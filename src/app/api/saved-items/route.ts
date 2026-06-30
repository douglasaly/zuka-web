import { NextResponse } from 'next/server'

import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { SavedItem } from '@/types/saved-items'

export async function GET() {
	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { data, error } = await supabase
			.from('saved_items')
			.select(`
				id,
				product:products (
					id,
					name,
					price,
					product_images (
						url
					),
					store:stores (
						name
					)
				)
			`)
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(8)

		if (error) throw error

		const items: SavedItem[] =
			data?.map(({ product }) => ({
				id: product.id,
				imageUrl: product.product_images?.[0]?.url ?? null,
				name: product.name,
				storeName: product.store.name,
				price: product.price,
			})) ?? []

		return NextResponse.json({ items })
	} catch (error) {
		console.error(error)

		return NextResponse.json(
			{ error: 'Failed to fetch saved items' },
			{ status: 500 }
		)
	}
}
