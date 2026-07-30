import { type NextRequest, NextResponse } from 'next/server'
import { requireSellerStore } from '@/lib/auth/seller'
import {
	ORDER_STATUS_LABELS,
	canCancelOrder,
	canMarkCompleted,
	canMarkShipping,
	type OrderStatus,
} from '@/lib/orders/status-transitions'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type BuyerRow = {
	id: string
	first_name: string | null
	last_name: string | null
	email: string | null
}

type ItemRow = {
	id: string
	quantity: number
	products: { name: string } | null
}

function buyerName(buyer: BuyerRow | null): string {
	if (!buyer) return 'Cliente'
	const name = [buyer.first_name, buyer.last_name]
		.filter(Boolean)
		.join(' ')
		.trim()
	return name || buyer.email || 'Cliente'
}

function itemsSummary(items: ItemRow[]): string {
	if (items.length === 0) return 'Sem itens'
	const names = items.map((item) => {
		const name = item.products?.name ?? 'Produto'
		return item.quantity > 1 ? `${name} ×${item.quantity}` : name
	})
	if (names.length === 1) return names[0]
	if (names.length === 2) return `${names[0]}, ${names[1]}`
	return `${names[0]} +${names.length - 1}`
}

export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { store } = auth
		const { searchParams } = new URL(request.url)
		const status = searchParams.get('status') ?? 'all'
		const date = searchParams.get('date') ?? 'all'
		const search = (searchParams.get('search') ?? '').trim().toLowerCase()
		const page = Math.max(Number(searchParams.get('page')) || 1, 1)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit')) || 50, 1),
			100
		)
		const from = (page - 1) * limit

		const supabase = createSupabaseAdmin()

		let query = supabase
			.from('orders')
			.select(
				`
				*,
				stores(name, logo_url),
				users!orders_buyer_id_fkey(id, first_name, last_name, email),
				order_items(id, quantity, products(name))
			`,
				{ count: 'exact' }
			)
			.eq('store_id', store.id as string)
			.is('deleted_at', null)

		if (status !== 'all') {
			query = query.eq(
				'status',
				status.toUpperCase() as OrderStatus
			)
		}

		if (date !== 'all') {
			const days = Number.parseInt(date, 10)
			if (!Number.isNaN(days)) {
				const cutoff = new Date(
					Date.now() - days * 86400000
				).toISOString()
				query = query.gte('created_at', cutoff)
			}
		}

		query = query.order('created_at', { ascending: false })

		const rangeEnd = from + limit
		const { data, error, count } = await query.range(from, rangeEnd)

		if (error) throw error

		const pageItems = (data ?? []).slice(0, limit) as Array<
			Record<string, unknown>
		>

		let orders = pageItems.map((row) => {
			const orderStatus = row.status as OrderStatus
			const buyer = (row.users as BuyerRow | null) ?? null
			const items = (row.order_items as ItemRow[] | null) ?? []
			const customerName = buyerName(buyer)

			return {
				id: row.id as string,
				shortId: String(row.id).slice(0, 8),
				customerName,
				customerEmail: buyer?.email ?? null,
				itemsSummary: itemsSummary(items),
				itemCount: row.item_count as number,
				total: Number(row.total) / 100,
				currency: row.currency as string,
				status: orderStatus,
				statusLabel: ORDER_STATUS_LABELS[orderStatus],
				date: row.created_at as string,
				reviewEligible: Boolean(row.review_eligible),
				reviewState: ((): 'none' | 'awaiting' | 'done' => {
					if (orderStatus !== 'COMPLETED') return 'none'
					if (row.review_eligible) return 'awaiting'
					return 'done'
				})(),
				allowedActions: {
					markShipping: canMarkShipping(orderStatus),
					markCompleted: canMarkCompleted(orderStatus),
					cancel: canCancelOrder(orderStatus),
				},
			}
		})

		if (search) {
			orders = orders.filter(
				(o) =>
					o.id.toLowerCase().includes(search) ||
					o.shortId.toLowerCase().includes(search) ||
					o.customerName.toLowerCase().includes(search) ||
					(o.customerEmail?.toLowerCase().includes(search) ?? false) ||
					o.itemsSummary.toLowerCase().includes(search)
			)
		}

		return NextResponse.json({
			success: true,
			orders,
			hasMore: (data?.length ?? 0) > limit,
			total: count ?? 0,
		})
	} catch (error) {
		console.error('[GET /api/seller/orders]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar os pedidos' },
			{ status: 500 }
		)
	}
}
