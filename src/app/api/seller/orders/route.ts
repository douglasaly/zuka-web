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

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const
const DEFAULT_PER_PAGE = 10

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

function parsePerPage(raw: string | null): number {
	const n = Number(raw ?? DEFAULT_PER_PAGE)
	if (PER_PAGE_OPTIONS.includes(n as (typeof PER_PAGE_OPTIONS)[number])) {
		return n
	}
	if (!Number.isNaN(n) && n >= 1 && n <= 100) return Math.floor(n)
	return DEFAULT_PER_PAGE
}

function mapOrder(row: Record<string, unknown>) {
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
}

function matchesSearch(
	order: ReturnType<typeof mapOrder>,
	search: string
): boolean {
	const q = search.toLowerCase()
	return (
		order.id.toLowerCase().includes(q) ||
		order.shortId.toLowerCase().includes(q) ||
		order.customerName.toLowerCase().includes(q) ||
		(order.customerEmail?.toLowerCase().includes(q) ?? false) ||
		order.itemsSummary.toLowerCase().includes(q)
	)
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
		const perPage = parsePerPage(
			searchParams.get('perPage') ?? searchParams.get('limit')
		)

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
			query = query.eq('status', status.toUpperCase() as OrderStatus)
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

		// Text requires post-filter for buyer/items — fetch matching set then page.
		if (search) {
			const { data, error } = await query.limit(2000)
			if (error) throw error

			const filtered = ((data ?? []) as Array<Record<string, unknown>>)
				.map(mapOrder)
				.filter((o) => matchesSearch(o, search))

			const total = filtered.length
			const totalPages = Math.max(1, Math.ceil(total / perPage))
			const safePage = Math.min(page, totalPages)
			const from = (safePage - 1) * perPage
			const orders = filtered.slice(from, from + perPage)

			return NextResponse.json({
				success: true,
				orders,
				page: safePage,
				perPage,
				total,
				totalPages,
				hasMore: safePage < totalPages,
			})
		}

		const from = (page - 1) * perPage
		const rangeEnd = from + perPage
		const { data, error, count } = await query.range(from, rangeEnd)

		if (error) throw error

		const total = count ?? 0
		const totalPages = Math.max(1, Math.ceil(total / perPage) || 1)
		const safePage = Math.min(page, totalPages)
		const pageItems = (data ?? []).slice(0, perPage) as Array<
			Record<string, unknown>
		>
		const orders = pageItems.map(mapOrder)

		return NextResponse.json({
			success: true,
			orders,
			page: safePage,
			perPage,
			total,
			totalPages,
			hasMore: (data?.length ?? 0) > perPage || safePage < totalPages,
		})
	} catch (error) {
		console.error('[GET /api/seller/orders]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar os pedidos' },
			{ status: 500 }
		)
	}
}
