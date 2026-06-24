import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface GetStoreProductsProps {
	params: Promise<{
		slug: string
	}>
}

export async function GET(req: Request, { params }: GetStoreProductsProps) {
	try {
		const { slug } = await params
		const { searchParams } = new URL(req.url)

		const cursor = searchParams.get('cursor')
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit') ?? 10), 1),
			20
		)

		const supabase = createSupabaseAdmin()

		const { data: store, error: storeError } = await supabase
			.from('stores')
			.select('id, name, slug')
			.eq('slug', slug)
			.is('deleted_at', null)
			.maybeSingle()

		if (storeError) {
			throw storeError
		}

		if (!store) {
			return NextResponse.json(
				{
					success: false,
					message: 'Store não encontrada',
				},
				{ status: 404 }
			)
		}

		let query = supabase
			.from('products')
			.select(
				`
				id,
				name,
				price,
				currency,
				slug,
				created_at,
				categories ( id, name ),
				product_images!inner ( url )
			`
			)
			.eq('store_id', String(store.id))
			.eq('is_visible', true)
			.in('status', ['ACTIVE', 'OUT_OF_STOCK'])
			.is('deleted_at', null)
			.eq('product_images.is_primary', true)
			.order('created_at', { ascending: false })
			.order('id', { ascending: false })
			.limit(limit + 1)

		if (cursor) {
			query = query.lt('id', cursor)
		}

		const { data: rows, error: productsError } = await query

		if (productsError) {
			throw productsError
		}

		const productRows = (rows ?? []) as Array<{
			id: string
			name: string
			slug: string | null
			price: number
			currency: string | null
			created_at: string | null
			categories: { id: string; name: string } | null
			product_images: Array<{ url: string }> | null
		}>
		let nextCursor: string | null = null

		if (productRows.length > limit) {
			const extra = productRows.pop()
			if (extra) {
				nextCursor = extra.id
			}
		}

		const productsData = productRows.map((product) => {
			const images = product.product_images
			const category = product.categories

			return {
				id: product.id,
				name: product.name,
				slug: product.slug,
				price: product.price,
				currency: product.currency,
				image: images?.[0]?.url ?? null,
				category,
			}
		})

		return NextResponse.json({
			success: true,
			data: {
				store,
				products: productsData,
			},
			metadata: {
				productCount: productsData.length,
			},
			pagination: {
				nextCursor,
				hasMore: nextCursor !== null,
				limit,
			},
		})
	} catch (error) {
		console.error(error)

		return NextResponse.json(
			{
				success: false,
				message: 'Erro ao buscar produtos da store',
			},
			{ status: 500 }
		)
	}
}
