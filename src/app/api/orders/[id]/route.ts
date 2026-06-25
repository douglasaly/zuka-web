import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { mapOrderRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await params
		const supabase = createSupabaseAdmin()

		const { data, error } = await supabase
			.from('orders')
			.select('*, stores(name, logo_url, slug)')
			.eq('id', id)
			.eq('buyer_id', user.id as string)
			.maybeSingle()

		if (error) throw error
		if (!data) {
			return NextResponse.json({ error: 'Not found' }, { status: 404 })
		}

		const row = data as Record<string, unknown>
		const order = mapOrderRow({
			id: row.id as string,
			total: row.total as number,
			currency: row.currency as string,
			item_count: row.item_count as number,
			status: row.status as string,
			created_at: row.created_at as string,
			stores: row.stores as { name: string; logo_url?: string | null },
		})

		const { data: items } = await supabase
			.from('order_items')
			.select('*, products(name, slug)')
			.eq('order_id', id)

		return NextResponse.json({
			success: true,
			order,
			storeSlug: (row.stores as { slug?: string } | null)?.slug ?? null,
			items: (items ?? []).map((item) => {
				const row = item as Record<string, unknown>
				const product = row.products as { name: string; slug?: string | null } | null
				return {
					id: row.id as string,
					quantity: row.quantity as number,
					unitPrice: row.unit_price as number,
					currency: row.currency as string,
					productName: product?.name ?? 'Produto',
					productSlug: product?.slug ?? null,
				}
			}),
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load order' },
			{ status: 500 }
		)
	}
}
