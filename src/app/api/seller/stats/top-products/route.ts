import { type NextRequest, NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
export async function GET(request: NextRequest) {
	try {
		const auth = await requireSellerStore({ permission: 'stats.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const { searchParams } = new URL(request.url)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit')) || 5, 1),
			10
		)
		const supabase = createSupabaseAdmin()
		const now = new Date()
		const thirtyDaysAgo = new Date(
			now.getTime() - 30 * 86400000
		).toISOString()
		const { data: orders } = await supabase
			.from('orders')
			.select('id')
			.eq('store_id', store.id)
			.gte('created_at', thirtyDaysAgo)
		const orderIds = (orders ?? []).map((o) => o.id as string)
		if (orderIds.length === 0) {
			return NextResponse.json({ data: [] })
		}
		const { data: items } = await supabase
			.from('order_items')
			.select('product_id, quantity, unit_price, currency')
			.in('order_id', orderIds)
		const productMap = new Map<
			string,
			{
				quantity: number
				revenue: number
				currency: string
			}
		>()
		for (const item of items ?? []) {
			const pid = item.product_id as string
			const existing = productMap.get(pid)
			const qty = (item.quantity as number) ?? 1
			const price = ((item.unit_price as number) ?? 0) / 100
			if (existing) {
				existing.quantity += qty
				existing.revenue += price * qty
			} else {
				productMap.set(pid, {
					quantity: qty,
					revenue: price * qty,
					currency: (item.currency as string) ?? 'MZN',
				})
			}
		}
		const sorted = Array.from(productMap.entries())
			.sort((a, b) => b[1].quantity - a[1].quantity)
			.slice(0, limit)
		const productIds = sorted.map(([id]) => id)
		const { data: products } = await supabase
			.from('products')
			.select('id, name, price, currency')
			.in('id', productIds)
		const productInfo = new Map(
			(products ?? []).map((p) => [
				p.id as string,
				{
					name: p.name as string,
					price: ((p.price as number) ?? 0) / 100,
					currency: (p.currency as string) ?? 'MZN',
				},
			])
		)
		const data = sorted.map(([id, stats]) => {
			const info = productInfo.get(id)
			return {
				id,
				name: info?.name ?? 'Produto',
				quantity: stats.quantity,
				revenue: stats.revenue,
				currency: stats.currency,
			}
		})
		return NextResponse.json({ data })
	} catch (err) {
		console.error('[GET /api/seller/stats/top-products]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
