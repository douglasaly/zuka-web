import { type NextRequest, NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore({ permission: 'stats.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const { searchParams } = new URL(request.url)
		const days = Math.min(
			Math.max(Number(searchParams.get('days')) || 7, 7),
			30
		)
		const supabase = createSupabaseAdmin()
		const now = new Date()
		const start = new Date(now.getTime() - days * 86400000)
		const { data: orders } = await supabase
			.from('orders')
			.select('total, created_at')
			.eq('store_id', store.id)
			.in('status', ['COMPLETED', 'SHIPPING'])
			.gte('created_at', start.toISOString())
			.order('created_at', { ascending: true })
		const dailyMap = new Map<string, number>()
		for (let i = 0; i < days; i++) {
			const d = new Date(start.getTime() + i * 86400000)
			const key = d.toISOString().split('T')[0]
			dailyMap.set(key, 0)
		}
		for (const order of orders ?? []) {
			const key = (order.created_at as string).split('T')[0]
			const prev = dailyMap.get(key) ?? 0
			dailyMap.set(key, prev + (order.total ?? 0))
		}
		const data = Array.from(dailyMap.entries()).map(([date, sales]) => ({
			date,
			sales,
		}))
		return NextResponse.json({ data })
	} catch (err) {
		console.error('[GET /api/seller/stats/daily]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
