import { type NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { CursorPaginationSchema } from '@/lib/validations'
import { mapBuyerOrder } from '@/modules/orders/lib/map-buyer-order'
import type { BuyerOrderStatus } from '@/modules/orders/types'

const STATUS_DB: Record<BuyerOrderStatus, OrderStatus[]> = {
	pending: ['PENDING', 'CONTACTED'],
	shipping: ['SHIPPING'],
	completed: ['COMPLETED'],
	cancelled: ['CANCELLED'],
}

const ORDER_SELECT = `
	*,
	stores(name, logo_url, slug),
	order_items(
		id,
		quantity,
		unit_price,
		currency,
		product_id,
		products(
			id,
			name,
			slug,
			product_images(url, is_primary, position, deleted_at)
		)
	)
`

const ORDER_SELECT_STORE = `
	*,
	stores!inner(name, logo_url, slug),
	order_items(
		id,
		quantity,
		unit_price,
		currency,
		product_id,
		products(
			id,
			name,
			slug,
			product_images(url, is_primary, position, deleted_at)
		)
	)
`

function periodCutoff(period: string | null): string | null {
	if (!period || period === 'all') return null
	const days = Number(period)
	if (!Number.isFinite(days) || days <= 0) return null
	return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

export async function GET(request: NextRequest) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = request.nextUrl
		const { limit, cursor } = CursorPaginationSchema.parse({
			limit: searchParams.get('limit') ?? 5,
			cursor: searchParams.get('cursor') ?? undefined,
		})

		const statusParam = searchParams.get('status') ?? 'all'
		const period = searchParams.get('period')
		const storeName = searchParams.get('store')
		const cutoff = periodCutoff(period)
		const useStoreInner = Boolean(storeName && storeName !== 'all')

		const supabase = createSupabaseAdmin()

		let query = supabase
			.from('orders')
			.select(useStoreInner ? ORDER_SELECT_STORE : ORDER_SELECT)
			.eq('buyer_id', user.id as string)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(limit + 1)

		if (cursor) {
			query = query.lt('created_at', cursor)
		}

		if (statusParam !== 'all' && statusParam in STATUS_DB) {
			query = query.in('status', STATUS_DB[statusParam as BuyerOrderStatus])
		}

		if (cutoff) {
			query = query.gte('created_at', cutoff)
		}

		if (useStoreInner && storeName) {
			query = query.eq('stores.name', storeName)
		}

		const [
			{ data, error },
			countsResult,
			storesResult,
			pendingReviewsResult,
		] = await Promise.all([
			query,
			supabase
				.from('orders')
				.select('status, review_eligible')
				.eq('buyer_id', user.id as string)
				.is('deleted_at', null),
			supabase
				.from('orders')
				.select('stores(name)')
				.eq('buyer_id', user.id as string)
				.is('deleted_at', null),
			supabase
				.from('orders')
				.select(ORDER_SELECT)
				.eq('buyer_id', user.id as string)
				.eq('status', 'COMPLETED')
				.eq('review_eligible', true)
				.is('deleted_at', null)
				.order('completed_at', { ascending: false })
				.limit(5),
		])

		if (error) throw error
		if (countsResult.error) throw countsResult.error
		if (storesResult.error) throw storesResult.error
		if (pendingReviewsResult.error) throw pendingReviewsResult.error

		const rows = (data ?? []) as unknown as Array<Record<string, unknown>>
		const hasMore = rows.length > limit
		const pageRows = hasMore ? rows.slice(0, limit) : rows
		const last = pageRows[pageRows.length - 1]
		const nextCursor =
			hasMore && last?.created_at ? String(last.created_at) : null

		const orders = pageRows.map((row) =>
			mapBuyerOrder(row as Parameters<typeof mapBuyerOrder>[0])
		)

		const counts = {
			all: 0,
			pending: 0,
			shipping: 0,
			completed: 0,
			cancelled: 0,
			reviewEligible: 0,
		}

		for (const row of countsResult.data ?? []) {
			counts.all += 1
			const mapped =
				row.status === 'SHIPPING'
					? 'shipping'
					: row.status === 'COMPLETED'
						? 'completed'
						: row.status === 'CANCELLED'
							? 'cancelled'
							: 'pending'
			counts[mapped] += 1
			if (row.status === 'COMPLETED' && row.review_eligible) {
				counts.reviewEligible += 1
			}
		}

		const storeNames = [
			...new Set(
				(storesResult.data ?? [])
					.map((row) => {
						const store = row.stores as { name?: string } | null
						return store?.name
					})
					.filter((name): name is string => Boolean(name))
			),
		].sort((a, b) => a.localeCompare(b, 'pt'))

		const pendingReviews = (
			(pendingReviewsResult.data ?? []) as unknown as Array<
				Parameters<typeof mapBuyerOrder>[0]
			>
		).map(mapBuyerOrder)

		return NextResponse.json({
			success: true,
			data: orders,
			pagination: {
				hasMore,
				nextCursor,
				limit,
			},
			counts,
			stores: storeNames,
			pendingReviews,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load orders' },
			{ status: 500 }
		)
	}
}
