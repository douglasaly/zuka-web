import { type NextRequest, NextResponse } from 'next/server'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { mapOrderRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { searchParams } = new URL(request.url)
		const status = searchParams.get('status') ?? 'all'
		const date = searchParams.get('date') ?? 'all'
		const page = Math.max(Number(searchParams.get('page')) || 1, 1)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit')) || 20, 1),
			100
		)
		const from = (page - 1) * limit

		const supabase = createSupabaseAdmin()

		const { data: sellerProfile } = await supabase
			.from('seller_profiles')
			.select('id')
			.eq('user_id', user.id as string)
			.maybeSingle()

		if (!sellerProfile) {
			return NextResponse.json({
				success: true,
				orders: [],
				hasMore: false,
			})
		}

		const { data: stores } = await supabase
			.from('stores')
			.select('id')
			.eq('seller_profile_id', sellerProfile.id as string)
			.is('deleted_at', null)

		const storeIds = (stores ?? []).map((s) => s.id as string)
		if (storeIds.length === 0) {
			return NextResponse.json({
				success: true,
				orders: [],
				hasMore: false,
			})
		}

		let query = supabase
			.from('orders')
			.select('*, stores(name, logo_url)', { count: 'exact' })
			.in('store_id', storeIds)

		if (status !== 'all') {
			query = query.eq(
				'status',
				status.toUpperCase() as
					| 'PENDING'
					| 'SHIPPING'
					| 'COMPLETED'
					| 'CANCELLED'
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
		const hasMore = (data?.length ?? 0) > limit

		const orders = pageItems.map((row) =>
			mapOrderRow({
				id: row.id as string,
				total: row.total as number,
				currency: row.currency as string,
				item_count: row.item_count as number,
				status: row.status as string,
				created_at: row.created_at as string,
				stores: row.stores as {
					name: string
					logo_url?: string | null
				},
			})
		)

		return NextResponse.json({
			success: true,
			orders,
			hasMore,
			total: count ?? 0,
		})
	} catch (error) {
		console.error('[GET /api/seller/orders]', error)
		return NextResponse.json(
			{ error: 'Failed to load seller orders' },
			{ status: 500 }
		)
	}
}
