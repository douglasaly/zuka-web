import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: Request) {
	await requireAdminUser()
	const { searchParams } = new URL(req.url)
	const days = Number(searchParams.get('days') ?? 30)

	const supabase = createSupabaseAdmin()
	const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

	// Signups per day
	const { data: rawUsers } = await supabase
		.from('users')
		.select('created_at')
		.gte('created_at', from)
		.is('deleted_at', null)
		.order('created_at')

	// Products per day
	const { data: rawProducts } = await supabase
		.from('products')
		.select('created_at')
		.gte('created_at', from)
		.is('deleted_at', null)
		.order('created_at')

	// Stores per day
	const { data: rawStores } = await supabase
		.from('stores')
		.select('created_at, status')
		.gte('created_at', from)
		.is('deleted_at', null)

	// Top stores
	const { data: topStores } = await supabase
		.from('stores')
		.select('id, name, slug, created_at')
		.eq('status', 'ACTIVE')
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.limit(10)

	const topStoresWithCounts = await Promise.all(
		(topStores ?? []).map(async (store) => {
			const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', store.id as string).is('deleted_at', null)
			const { count: followers } = await supabase.from('store_followers').select('*', { count: 'exact', head: true }).eq('store_id', store.id as string)
			return { ...store, products: products ?? 0, followers: followers ?? 0 }
		})
	)

	function groupByDay(rows: Array<{ created_at: string | null }>) {
		const map: Record<string, number> = {}
		for (const row of rows ?? []) {
			if (!row.created_at) continue
			const day = row.created_at.slice(0, 10)
			map[day] = (map[day] ?? 0) + 1
		}
		// Fill in all days in range
		const result: Array<{ date: string; count: number }> = []
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
			result.push({ date: d, count: map[d] ?? 0 })
		}
		return result
	}

	const signupsByDay = groupByDay((rawUsers ?? []) as Array<{ created_at: string | null }>)
	const productsByDay = groupByDay((rawProducts ?? []) as Array<{ created_at: string | null }>)
	const storesByDay = groupByDay((rawStores ?? []) as Array<{ created_at: string | null }>)

	const approvedStores = (rawStores ?? []).filter((s) => s.status === 'ACTIVE').length
	const totalStoresInPeriod = (rawStores ?? []).length
	const approvalRate = totalStoresInPeriod > 0 ? Math.round((approvedStores / totalStoresInPeriod) * 100) : 0

	return NextResponse.json({
		signupsByDay,
		productsByDay,
		storesByDay,
		approvalRate,
		topStores: topStoresWithCounts,
	})
}
