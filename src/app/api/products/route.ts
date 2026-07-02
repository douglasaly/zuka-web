import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireSellerStore } from '@/lib/auth/seller'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { shuffle } from '@/utils/shuffle'
import { Slug } from '@/utils/slug'

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
	stores: Record<string, unknown> | null
	categories: Record<string, unknown> | null
	product_images: Array<Record<string, unknown>> | null
}

function groupProductsWithRelations(rows: ProductRow[]) {
	const map = new Map<
		string,
		{
			product: Record<string, unknown>
			store: Record<string, unknown> | null
			category: Record<string, unknown> | null
			images: Array<Record<string, unknown>>
		}
	>()

	for (const row of rows) {
		if (!map.has(row.id)) {
			const { stores, categories, product_images, ...product } = row
			map.set(row.id, {
				product,
				store: stores,
				category: categories,
				images: product_images ?? [],
			})
		}
	}

	return Array.from(map.values())
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)

		const category = searchParams.get('category')
		const search = searchParams.get('search')

		const page = Number(searchParams.get('page') ?? 1)
		const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
		const offset = (page - 1) * limit

		const supabase = createSupabaseAdmin()
		let query = supabase
			.from('products')
			.select('*, stores!inner(*), categories(*), product_images(*)')
			.eq('is_visible', true)
			.is('deleted_at', null)
			.eq('stores.status', 'ACTIVE')
			.is('stores.deleted_at', null)
			.range(offset, offset + limit - 1)

		if (category) {
			query = query.eq('category_id', category)
		}

		if (search) {
			query = query.ilike('name', `%${search}%`)
		}

		const { data, error } = await query

		if (error) {
			throw error
		}

		let result = groupProductsWithRelations((data ?? []) as ProductRow[])

		const groupedByStore: Record<string, typeof result> = {}

		for (const item of result) {
			const storeId = item.store?.id as string | undefined
			if (!storeId) continue

			if (!groupedByStore[storeId]) {
				groupedByStore[storeId] = []
			}

			groupedByStore[storeId].push(item)
		}

		const final: typeof result = []

		for (const storeId in groupedByStore) {
			const items = shuffle(groupedByStore[storeId]).slice(0, 2)
			final.push(...items)
		}

		result = shuffle(final)

		return NextResponse.json({
			success: true,
			products: result,
			metadata: {
				page,
				totalCount: result.length,
				limit,
			},
		})
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar produtos',
			},
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { store } = auth
		const body = await request.json()
		const {
			name,
			description,
			categoryId,
			price,
			discountPrice,
			currency = 'MZN',
			quantity = 1,
			imageUrl,
		} = body

		if (!name || !categoryId || price == null) {
			return NextResponse.json(
				{ error: 'Nome, categoria e preço são obrigatórios' },
				{ status: 400 }
			)
		}

		if (imageUrl && !isR2PublicUrl(imageUrl)) {
			return NextResponse.json(
				{
					error: 'A imagem do produto deve ser carregada para o armazenamento',
				},
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()
		const productId = uuidv7()
		let slug = Slug(name)

		const { data: slugConflict } = await supabase
			.from('products')
			.select('id')
			.eq('slug', slug)
			.maybeSingle()

		if (slugConflict) {
			slug = `${slug}-${uuidv7().slice(0, 6)}`
		}

		const { data: product, error: productError } = await supabase
			.from('products')
			.insert({
				id: productId,
				store_id: store.id as string,
				category_id: categoryId,
				name,
				slug,
				description: description ?? null,
				is_visible: true,
				status: 'ACTIVE',
				price: Number(price),
				discount_price:
					discountPrice != null ? Number(discountPrice) : null,
				currency,
			})
			.select('*')
			.single()

		if (productError) throw productError

		await supabase.from('product_stock').insert({
			id: uuidv7(),
			product_id: productId,
			quantity: Number(quantity) || 1,
			reserved: 0,
		})

		if (imageUrl) {
			await supabase.from('product_images').insert({
				id: uuidv7(),
				product_id: productId,
				url: imageUrl,
				position: 0,
				is_primary: true,
				alt: name,
			})
		}

		return NextResponse.json({ success: true, product })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Falha ao publicar produto' },
			{ status: 500 }
		)
	}
}
