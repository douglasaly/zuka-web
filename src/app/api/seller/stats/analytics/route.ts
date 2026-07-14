import { type NextRequest, NextResponse } from 'next/server'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error
		const { store } = auth

		const { searchParams } = new URL(request.url)
		const range = Math.min(
			Math.max(Number(searchParams.get('range')) || 30, 7),
			90
		)

		const supabase = createSupabaseAdmin()
		const currentStart = new Date(
			Date.now() - range * 86400000
		).toISOString()

		// --- Vendas + pedidos no período ---
		const { data: orders } = await supabase
			.from('orders')
			.select('total')
			.eq('store_id', store.id)
			.in('status', ['COMPLETED', 'SHIPPING'])
			.gte('created_at', currentStart)

		const totalSales = (orders ?? []).reduce(
			(acc, o) => acc + (o.total ?? 0),
			0
		)
		const totalOrders = orders?.length ?? 0
		const averageTicket =
			totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0

		// --- Seguidores ---
		const { count: totalFollowers } = await supabase
			.from('store_followers')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', store.id)

		// --- Produtos activos ---
		const { count: productCount } = await supabase
			.from('products')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', store.id)
			.eq('status', 'ACTIVE')
			.is('deleted_at', null)

		return NextResponse.json({
			data: {
				totalSales,
				totalOrders,
				totalViews: 0,
				totalFollowers: totalFollowers ?? 0,
				averageTicket,
				productCount: productCount ?? 0,
			},
		})
	} catch (err) {
		console.error('[GET /api/seller/stats/analytics]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
