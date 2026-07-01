import { NextResponse } from 'next/server'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { store } = auth
		const supabase = createSupabaseAdmin()

		const { data, error } = await supabase
			.from('products')
			.select('*, categories(name), product_images(url, is_primary)')
			.eq('store_id', store.id as string)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })

		if (error) throw error

		const products = (data ?? []).map((row) => {
			const record = row as Record<string, unknown>
			const images = record.product_images as Array<{
				url: string
				is_primary?: boolean
			}> | null
			const primary = images?.find((img) => img.is_primary) ?? images?.[0]

			return {
				id: record.id as string,
				name: record.name as string,
				price: record.price as number,
				discountPrice: record.discount_price as number | null,
				currency: record.currency as string,
				status: record.status as string,
				isVisible: record.is_visible as boolean,
				categoryName:
					(record.categories as { name: string } | null)?.name ??
					null,
				image: primary?.url ?? null,
			}
		})

		return NextResponse.json({ success: true, products, store })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Falha ao carregar produtos da loja' },
			{ status: 500 }
		)
	}
}
