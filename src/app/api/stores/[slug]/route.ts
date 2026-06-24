import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface GetStoreProps {
	params: Promise<{ slug: string }>
}

type ProductRow = {
	id: string
	store_id: string
	category_id: string
	name: string
	slug: string | null
	is_visible: boolean | null
	description: string | null
	status: string | null
	price: number
	discount_price: number | null
	currency: string | null
	created_at: string | null
	updated_at: string | null
	deleted_at: string | null
	categories: Record<string, unknown> | null
	product_images: Array<Record<string, unknown>> | null
}

function groupStoreProducts(rows: ProductRow[]) {
	const map = new Map<
		string,
		{
			product: Record<string, unknown>
			category: Record<string, unknown> | null
			images: Array<Record<string, unknown>>
		}
	>()

	for (const row of rows) {
		if (!map.has(row.id)) {
			const { categories, product_images, ...product } = row
			map.set(row.id, {
				product,
				category: categories,
				images: product_images ?? [],
			})
		}
	}

	return Array.from(map.values())
}

export async function GET(req: Request, { params }: GetStoreProps) {
	try {
		const { slug } = await params
		const { searchParams } = new URL(req.url)

		const page = Number(searchParams.get('page') ?? 1)
		const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
		const offset = (page - 1) * limit
		const category = searchParams.get('category')

		const supabase = createSupabaseAdmin()

		const { data: store, error: storeError } = await supabase
			.from('stores')
			.select('*, provinces(name)')
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

		const storeRow = store as Record<string, unknown>
		const storeId = String(storeRow.id)

		let productsQuery = supabase
			.from('products')
			.select('*, categories(*), product_images(*)')
			.eq('store_id', storeId)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1)

		if (category) {
			productsQuery = productsQuery.eq('category_id', category)
		}

		const { data: productsRows, error: productsError } = await productsQuery

		if (productsError) {
			throw productsError
		}

		const productsData = groupStoreProducts(
			(productsRows ?? []) as ProductRow[]
		)

		const { count: productCount } = await supabase
			.from('products')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', storeId)
			.is('deleted_at', null)

		const { count: followerCount } = await supabase
			.from('store_followers')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', storeId)

		return NextResponse.json({
			success: true,
			data: {
				store: {
					...storeRow,
					product_count: productCount ?? 0,
					follower_count: followerCount ?? 0,
				},
				products: productsData,
				page,
				limit,
			},
		})
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar store',
			},
			{ status: 500 }
		)
	}
}
