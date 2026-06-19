import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema/categories'
import { productImages } from '@/db/schema/product-images'
import { products } from '@/db/schema/products'
import { stores } from '@/db/schema/stores'

interface GetStoreProps {
	params: Promise<{ slug: string }>
}

export async function GET(req: Request, { params }: GetStoreProps) {
	try {
		const { slug } = await params

		const { searchParams } = new URL(req.url)

		const page = Number(searchParams.get('page') ?? 1)
		const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
		const offset = (page - 1) * limit
		const category = searchParams.get('category')

		const storeResult = await db
			.select()
			.from(stores)
			.where(eq(stores.slug, slug))
			.limit(1)

		if (!storeResult.length) {
			return NextResponse.json(
				{
					success: false,
					message: 'Store não encontrada',
				},
				{ status: 404 }
			)
		}

		const store = storeResult[0]

		const conditions = [eq(products.storeId, store.id)]

		if (category) {
			conditions.push(eq(products.categoryId, category))
		}

		const rows = await db
			.select({
				product: products,
				category: categories,
				image: productImages,
			})
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(productImages, eq(productImages.productId, products.id))
			.where(eq(products.storeId, store.id))
			.orderBy(desc(products.createdAt))
			.limit(limit)
			.offset(offset)

		const map = new Map<string, any>()

		for (const row of rows) {
			const id = row.product.id

			if (!map.has(id)) {
				map.set(id, {
					product: row.product,
					category: row.category,
					images: [],
				})
			}

			const item = map.get(id)

			if (row.image) {
				item.images.push(row.image)
			}
		}

		const productsData = Array.from(map.values())

		return NextResponse.json({
			success: true,
			data: {
				store,
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
