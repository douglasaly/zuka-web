import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { SavedItem } from '@/types/saved-items'

type SavedProductEmbed = {
	id: string
	name: string
	price: number
	product_images?:
		| {
				url: string
				is_primary: boolean
		  }[]
		| null
	store?: {
		name: string
		slug: string
		logo_url: string | null
		status: string
		deleted_at: string | null
	} | null
}
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
					product:products!inner (
						id,
						name,
						price,
						deleted_at,
						product_images (
							url,
							is_primary
						),
						store:stores!inner (
							name,
							slug,
							logo_url,
							status,
							deleted_at
						)
					)
				`)
			.eq('user_id', user.id)
			.is('product.deleted_at', null)
			.eq('product.store.status', 'ACTIVE')
			.is('product.store.deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(8)
		if (error) throw error
		const items: SavedItem[] = (data ?? []).flatMap((row) => {
			const product = row.product as SavedProductEmbed | null
			const store = product?.store
			if (
				!product ||
				!store ||
				store.status !== 'ACTIVE' ||
				store.deleted_at != null
			) {
				return []
			}
			return [
				{
					id: product.id,
					imageUrl:
						product.product_images?.find((img) => img.is_primary)
							?.url ??
						product.product_images?.[0]?.url ??
						null,
					name: product.name,
					storeName: store.name,
					price: product.price / 100,
					storeImage: store.logo_url,
					storeSlug: store.slug,
				},
			]
		})
		return NextResponse.json({ items })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to fetch saved items' },
			{ status: 500 }
		)
	}
}
