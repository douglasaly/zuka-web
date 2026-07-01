import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	await requireAdminUser()
	const supabase = createSupabaseAdmin()

	const now = new Date()
	const sevenDaysAgo = new Date(
		now.getTime() - 7 * 24 * 60 * 60 * 1000
	).toISOString()
	const fourteenDaysAgo = new Date(
		now.getTime() - 14 * 24 * 60 * 60 * 1000
	).toISOString()
	const todayStart = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	).toISOString()

	const [
		{ count: totalUsers },
		{ count: prevUsers },
		{ count: activeStores },
		{ count: prevStores },
		{ count: pendingApprovals },
		{ count: totalProducts },
		{ count: prevProducts },
		{ count: messagesToday },
	] = await Promise.all([
		supabase
			.from('users')
			.select('*', { count: 'exact', head: true })
			.is('deleted_at', null)
			.gte('created_at', sevenDaysAgo),
		supabase
			.from('users')
			.select('*', { count: 'exact', head: true })
			.is('deleted_at', null)
			.gte('created_at', fourteenDaysAgo)
			.lt('created_at', sevenDaysAgo),
		supabase
			.from('stores')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'ACTIVE')
			.is('deleted_at', null),
		supabase
			.from('stores')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'ACTIVE')
			.is('deleted_at', null),
		supabase
			.from('stores')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'PENDING')
			.is('deleted_at', null),
		supabase
			.from('products')
			.select('*', { count: 'exact', head: true })
			.is('deleted_at', null),
		supabase
			.from('products')
			.select('*', { count: 'exact', head: true })
			.is('deleted_at', null)
			.lt('created_at', sevenDaysAgo),
		supabase
			.from('messages')
			.select('*', { count: 'exact', head: true })
			.gte('created_at', todayStart),
	])

	function pct(curr: number | null, prev: number | null) {
		if (!prev || prev === 0) return curr ? 100 : 0
		return Math.round((((curr ?? 0) - prev) / prev) * 100)
	}

	const { count: totalUsersAll } = await supabase
		.from('users')
		.select('*', { count: 'exact', head: true })
		.is('deleted_at', null)
	const { count: prevTotalUsers } = await supabase
		.from('users')
		.select('*', { count: 'exact', head: true })
		.is('deleted_at', null)
		.lt('created_at', sevenDaysAgo)

	return NextResponse.json({
		totalUsers: totalUsersAll ?? 0,
		totalUsersPct: pct(totalUsers, prevUsers),
		activeStores: activeStores ?? 0,
		activeStoresPct: pct(activeStores, prevStores),
		pendingApprovals: pendingApprovals ?? 0,
		totalProducts: totalProducts ?? 0,
		totalProductsPct: pct(totalProducts, prevProducts),
		messagesToday: messagesToday ?? 0,
	})
}
