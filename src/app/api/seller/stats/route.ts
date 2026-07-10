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
		const now = new Date()
		const currentStart = new Date(now.getTime() - range * 86400000)
		const prevStart = new Date(
			currentStart.getTime() - range * 86400000
		)

		// --- Vendas (total de pedidos COMPLETED + SHIPPING) ---
		const { data: currentSales } = await supabase
			.from('orders')
			.select('total')
			.eq('store_id', store.id)
			.in('status', ['COMPLETED', 'SHIPPING'])
			.gte('created_at', currentStart.toISOString())

		const { data: prevSales } = await supabase
			.from('orders')
			.select('total')
			.eq('store_id', store.id)
			.in('status', ['COMPLETED', 'SHIPPING'])
			.gte('created_at', prevStart.toISOString())
			.lt('created_at', currentStart.toISOString())

		const sumTotal = (rows: { total: number }[] | null) =>
			(rows ?? []).reduce((acc, r) => acc + (r.total ?? 0), 0)

		const totalSales = sumTotal(currentSales)
		const totalSalesPrev = sumTotal(prevSales)

		// --- Total de pedidos ---
		const { count: totalOrders } = await supabase
			.from('orders')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', store.id)
			.gte('created_at', currentStart.toISOString())

		const { count: totalOrdersPrev } = await supabase
			.from('orders')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', store.id)
			.gte('created_at', prevStart.toISOString())
			.lt('created_at', currentStart.toISOString())

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

		const calcPct = (current: number, prev: number) => {
			if (prev === 0) return current > 0 ? 100 : 0
			return Math.round(((current - prev) / prev) * 100)
		}

		return NextResponse.json({
			data: {
				totalSales,
				totalSalesPrev,
				totalSalesPct: calcPct(totalSales, totalSalesPrev),
				totalOrders: totalOrders ?? 0,
				totalOrdersPrev: totalOrdersPrev ?? 0,
				totalOrdersPct: calcPct(totalOrders ?? 0, totalOrdersPrev ?? 0),
				totalFollowers: totalFollowers ?? 0,
				productCount: productCount ?? 0,
			},
		})
	} catch (err) {
		console.error('[GET /api/seller/stats]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
