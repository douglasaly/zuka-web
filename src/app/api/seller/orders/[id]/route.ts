import { type NextRequest, NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import {
	canTransition,
	ORDER_STATUS_LABELS,
	ORDER_STATUS_TRANSITIONS,
	parseOrderStatus,
	type OrderStatus,
} from '@/lib/orders/status-transitions'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { uuidv7 } from 'uuidv7'

type OrderUpdate = Database['public']['Tables']['orders']['Update']

type BuyerRow = {
	id: string
	first_name: string | null
	last_name: string | null
	email: string | null
	phone_number: string | null
	avatar_url: string | null
}

type OrderItemRow = {
	id: string
	quantity: number
	unit_price: number
	currency: string
	products: {
		id: string
		name: string
		slug: string | null
	} | null
}

function buyerName(buyer: BuyerRow | null): string {
	if (!buyer) return 'Cliente'
	const name = [buyer.first_name, buyer.last_name]
		.filter(Boolean)
		.join(' ')
		.trim()
	return name || buyer.email || 'Cliente'
}

function mapDetail(row: Record<string, unknown>) {
	const status = row.status as OrderStatus
	const buyer = (row.users as BuyerRow | null) ?? null
	const items = (row.order_items as OrderItemRow[] | null) ?? []
	const store = row.stores as { name: string; logo_url?: string | null } | null

	const timeline: Array<{
		status: OrderStatus
		label: string
		at: string
		note?: string
	}> = [
		{
			status: 'PENDING',
			label: 'Pedido recebido',
			at: (row.created_at as string) ?? new Date().toISOString(),
		},
	]

	if (status === 'SHIPPING' || status === 'COMPLETED') {
		timeline.push({
			status: 'SHIPPING',
			label: 'Em envio',
			at:
				(row.updated_at as string) ??
				(row.created_at as string) ??
				new Date().toISOString(),
		})
	}

	if (status === 'CONTACTED') {
		timeline.push({
			status: 'CONTACTED',
			label: 'Cliente contactado',
			at:
				(row.updated_at as string) ??
				(row.created_at as string) ??
				new Date().toISOString(),
		})
	}

	if (status === 'COMPLETED' && row.completed_at) {
		timeline.push({
			status: 'COMPLETED',
			label: 'Entregue',
			at: row.completed_at as string,
			note: 'Cliente pode avaliar a loja e os produtos',
		})
	}

	if (status === 'CANCELLED') {
		timeline.push({
			status: 'CANCELLED',
			label: 'Cancelado',
			at:
				(row.updated_at as string) ??
				(row.created_at as string) ??
				new Date().toISOString(),
			note: (row.notes as string | null) ?? undefined,
		})
	}

	return {
		id: row.id as string,
		storeId: row.store_id as string,
		storeName: store?.name ?? 'Loja',
		storeAvatar: store?.logo_url ?? null,
		status,
		statusLabel: ORDER_STATUS_LABELS[status],
		total: Number(row.total) / 100,
		currency: row.currency as string,
		itemCount: row.item_count as number,
		date: row.created_at as string,
		createdAt: row.created_at as string,
		updatedAt: row.updated_at as string | null,
		completedAt: row.completed_at as string | null,
		completedBy: row.completed_by as string | null,
		reviewEligible: Boolean(row.review_eligible),
		notes: row.notes as string | null,
		buyer: {
			id: buyer?.id ?? null,
			name: buyerName(buyer),
			email: buyer?.email ?? null,
			phone: buyer?.phone_number ?? null,
			avatarUrl: buyer?.avatar_url ?? null,
		},
		items: items.map((item) => ({
			id: item.id,
			quantity: item.quantity,
			unitPrice: item.unit_price / 100,
			currency: item.currency,
			productId: item.products?.id ?? null,
			productName: item.products?.name ?? 'Produto',
			productSlug: item.products?.slug ?? null,
		})),
		timeline,
		reviewState: ((): 'none' | 'awaiting' | 'done' => {
			if (status !== 'COMPLETED') return 'none'
			if (row.review_eligible) return 'awaiting'
			return 'done'
		})(),
	}
}

async function loadOwnedOrder(orderId: string, storeId: string) {
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('orders')
		.select(
			`
			*,
			stores(name, logo_url),
			users!orders_buyer_id_fkey(id, first_name, last_name, email, phone_number, avatar_url),
			order_items(id, quantity, unit_price, currency, products(id, name, slug))
		`
		)
		.eq('id', orderId)
		.eq('store_id', storeId)
		.is('deleted_at', null)
		.maybeSingle()

	if (error) throw error
	return data as Record<string, unknown> | null
}

export async function GET(
	_request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const auth = await requireSellerStore({ permission: 'order.read' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const { store } = auth
		const { id } = await context.params
		const row = await loadOwnedOrder(id, store.id as string)

		if (!row) {
			return NextResponse.json(
				{ error: 'Pedido não encontrado nesta loja' },
				{ status: 404 }
			)
		}

		return NextResponse.json({
			success: true,
			order: mapDetail(row),
		})
	} catch (error) {
		console.error('[GET /api/seller/orders/[id]]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar o pedido' },
			{ status: 500 }
		)
	}
}

export async function PATCH(
	request: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const auth = await requireSellerStore({ permission: 'order.update' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const { user, store } = auth
		const { id } = await context.params
		const body = (await request.json()) as {
			status?: string
			notes?: string
		}

		const nextStatus = parseOrderStatus(body.status ?? '')
		if (!nextStatus) {
			return NextResponse.json(
				{
					error: 'Estado inválido. Use PENDING, SHIPPING, COMPLETED ou CANCELLED.',
				},
				{ status: 400 }
			)
		}

		const row = await loadOwnedOrder(id, store.id as string)
		if (!row) {
			return NextResponse.json(
				{ error: 'Pedido não encontrado nesta loja' },
				{ status: 404 }
			)
		}

		const currentStatus = row.status as OrderStatus

		if (currentStatus === nextStatus) {
			return NextResponse.json({
				success: true,
				order: mapDetail(row),
				idempotent: true,
			})
		}

		if (!canTransition(currentStatus, nextStatus)) {
			return NextResponse.json(
				{
					error: `Não é possível passar de «${ORDER_STATUS_LABELS[currentStatus]}» para «${ORDER_STATUS_LABELS[nextStatus]}».`,
					allowed: [...ORDER_STATUS_TRANSITIONS[currentStatus]],
				},
				{ status: 409 }
			)
		}

		const now = new Date().toISOString()
		const update: OrderUpdate = {
			status: nextStatus,
			updated_at: now,
		}

		if (body.notes?.trim()) {
			update.notes = body.notes.trim()
		}

		if (nextStatus === 'COMPLETED') {
			update.completed_at = now
			update.completed_by = user.id
			update.review_eligible = true
		}

		if (nextStatus === 'CANCELLED' && !body.notes?.trim()) {
			update.notes = 'Cancelado pela loja'
		}

		const supabase = createSupabaseAdmin()
		const { data: updated, error: updateError } = await supabase
			.from('orders')
			.update(update)
			.eq('id', id)
			.eq('store_id', store.id as string)
			.select(
				`
				*,
				stores(name, logo_url),
				users!orders_buyer_id_fkey(id, first_name, last_name, email, phone_number, avatar_url),
				order_items(id, quantity, unit_price, currency, products(id, name, slug))
			`
			)
			.single()

		if (updateError) throw updateError

		if (nextStatus === 'COMPLETED') {
			const buyerId = updated.buyer_id as string
			const shortId = String(updated.id).slice(0, 8)
			const { error: notifError } = await supabase
				.from('notifications')
				.insert({
					id: uuidv7(),
					user_id: buyerId,
					type: 'review',
					title: 'Como correu a sua compra?',
					body: `O pedido #${shortId} da loja ${store.name} foi entregue. Avalie a loja e os produtos. A sua opinião ajuda outros compradores.`,
					link: `/pedidos/${updated.id}`,
					sender_store_id: store.id as string,
				})

			if (notifError) {
				console.error(
					'[PATCH /api/seller/orders/[id]] review notification',
					notifError
				)
			}
		}

		if (nextStatus === 'SHIPPING' || nextStatus === 'CANCELLED') {
			const buyerId = updated.buyer_id as string
			const shortId = String(updated.id).slice(0, 8)
			const title =
				nextStatus === 'SHIPPING'
					? 'O seu pedido está a caminho'
					: 'Pedido cancelado'
			const bodyText =
				nextStatus === 'SHIPPING'
					? `A loja ${store.name} marcou o pedido #${shortId} como em envio.`
					: `A loja ${store.name} cancelou o pedido #${shortId}.`
			const { error: notifError } = await supabase
				.from('notifications')
				.insert({
					id: uuidv7(),
					user_id: buyerId,
					type: 'order',
					title,
					body: bodyText,
					link: `/pedidos/${updated.id}`,
					sender_store_id: store.id as string,
				})

			if (notifError) {
				console.error(
					'[PATCH /api/seller/orders/[id]] order notification',
					notifError
				)
			}
		}

		return NextResponse.json({
			success: true,
			order: mapDetail(updated as Record<string, unknown>),
		})
	} catch (error) {
		console.error('[PATCH /api/seller/orders/[id]]', error)
		return NextResponse.json(
			{ error: 'Não foi possível actualizar o estado do pedido' },
			{ status: 500 }
		)
	}
}
