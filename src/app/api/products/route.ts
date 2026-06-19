import { and, eq, ilike } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema/categories'
import { productImages } from '@/db/schema/product-images'
import { products } from '@/db/schema/products'
import { stores } from '@/db/schema/stores'
import { shuffle } from '@/utils/shuffle'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)

		const category = searchParams.get('category')
		const search = searchParams.get('search')

		const page = Number(searchParams.get('page') ?? 1)
		const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
		const offset = (page - 1) * limit

		const conditions = []

		if (category) {
			conditions.push(eq(products.id, category))
		}

		if (search) {
			conditions.push(ilike(products.name, `%${search}%`))
		}

		const whereClause = conditions.length ? and(...conditions) : undefined

		const rows = await db
			.select({
				product: products,
				store: stores,
				category: categories,
				image: productImages,
			})
			.from(products)
			.leftJoin(stores, eq(products.storeId, stores.id))
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(productImages, eq(productImages.productId, products.id))
			.where(whereClause)
			.limit(limit)
			.offset(offset)

		// agrupar por produto
		const map = new Map<string, any>()

		for (const row of rows) {
			const id = row.product.id

			if (!map.has(id)) {
				map.set(id, {
					product: row.product,
					store: row.store,
					category: row.category,
					images: [],
				})
			}

			const item = map.get(id)

			if (row.image) {
				item.images.push(row.image)
			}
		}

		// converter + random
		let result = Array.from(map.values())

		//  2 items por loja
		const groupedByStore: Record<string, any[]> = {}

		for (const item of result) {
			const storeId = item.store?.id
			if (!storeId) continue

			if (!groupedByStore[storeId]) {
				groupedByStore[storeId] = []
			}

			groupedByStore[storeId].push(item)
		}

		const final: any[] = []

		for (const storeId in groupedByStore) {
			const items = shuffle(groupedByStore[storeId]).slice(0, 2)
			final.push(...items)
		}

		result = shuffle(final)

		const response = {
			success: true,
			products: result,
			metadata: {
				page,
				totalCount: result.length,
				limit,
			},
		}

		return NextResponse.json(response)
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
