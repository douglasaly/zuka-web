import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { withErrorHandling } from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

function nestedCount(value: unknown): number {
	if (!Array.isArray(value)) return 0
	const first = value[0] as { count?: number } | undefined
	return first?.count ?? 0
}

function groupByDay(rows: Array<{ created_at: string | null }>, days: number) {
	const map: Record<string, number> = {}
	for (const row of rows) {
		if (!row.created_at) continue
		const day = row.created_at.slice(0, 10)
		map[day] = (map[day] ?? 0) + 1
	}
	const result: Array<{ date: string; count: number }> = []
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
			.toISOString()
			.slice(0, 10)
		result.push({ date: d, count: map[d] ?? 0 })
	}
	return result
}

export const GET = withErrorHandling(async (request: NextRequest) => {
	await requireAdminUser()
	const days = Math.min(
		Math.max(
			Number(request.nextUrl.searchParams.get('days') ?? 30) || 30,
			1
		),
		90
	)
	const supabase = createSupabaseAdmin()
	const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
	const [usersResult, productsResult, storesResult, topStoresResult] =
		await Promise.all([
			supabase
				.from('users')
				.select('created_at')
				.gte('created_at', from)
				.is('deleted_at', null)
				.order('created_at'),
			supabase
				.from('products')
				.select('created_at')
				.gte('created_at', from)
				.is('deleted_at', null)
				.order('created_at'),
			supabase
				.from('stores')
				.select('created_at, status')
				.gte('created_at', from)
				.is('deleted_at', null),
			supabase
				.from('stores')
				.select(
					`
					id, name, slug, created_at,
					product_count:products(count),
					follower_count:store_followers(count)
				`
				)
				.eq('status', 'ACTIVE')
				.is('deleted_at', null)
				.order('created_at', { ascending: false })
				.limit(10),
		])
	if (usersResult.error) throw usersResult.error
	if (productsResult.error) throw productsResult.error
	if (storesResult.error) throw storesResult.error
	if (topStoresResult.error) throw topStoresResult.error
	const rawStores = storesResult.data ?? []
	const approvedStores = rawStores.filter((s) => s.status === 'ACTIVE').length
	const totalStoresInPeriod = rawStores.length
	const approvalRate =
		totalStoresInPeriod > 0
			? Math.round((approvedStores / totalStoresInPeriod) * 100)
			: 0
	const topStores = (topStoresResult.data ?? []).map((store) => {
		const { product_count, follower_count, ...rest } = store
		return {
			...rest,
			products: nestedCount(product_count),
			followers: nestedCount(follower_count),
		}
	})
	return NextResponse.json({
		signupsByDay: groupByDay(usersResult.data ?? [], days),
		productsByDay: groupByDay(productsResult.data ?? [], days),
		storesByDay: groupByDay(rawStores, days),
		approvalRate,
		topStores,
	})
})
