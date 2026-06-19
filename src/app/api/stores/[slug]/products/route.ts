import { and, desc, eq, lt, or } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { categories } from '@/db/schema/categories'
import { productImages } from '@/db/schema/product-images'
import { products } from '@/db/schema/products'
import { stores } from '@/db/schema/stores'

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

		const [store] = await db
			.select({
				id: stores.id,
				name: stores.name,
				slug: stores.slug,
			})
			.from(stores)
			.where(eq(stores.slug, slug))
			.limit(1)

		if (!store) {
			return NextResponse.json(
				{
					success: false,
					message: 'Store não encontrada',
				},
				{ status: 404 }
			)
		}

		const conditions = [
			eq(products.storeId, store.id),
			eq(products.isVisible, true),
			or(
				eq(products.status, 'ACTIVE'),
				eq(products.status, 'OUT_OF_STOCK')
			),
		]

		if (cursor) {
			conditions.push(lt(products.id, cursor))
		}

		const rows = await db
			.select({
				id: products.id,
				name: products.name,
				price: products.price,
				currency: products.currency,
				slug: products.slug,
				createdAt: products.createdAt,

				category: {
					id: categories.id,
					name: categories.name,
				},

				image: productImages.url,
			})
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(
				productImages,
				and(
					eq(productImages.productId, products.id),
					eq(productImages.isPrimary, true)
				)
			)
			.where(and(...conditions))
			.orderBy(desc(products.createdAt), desc(products.id))
			.limit(limit + 1)

		let nextCursor: string | null = null

		if (rows.length > limit) {
			const extra = rows.pop()

			if (extra) {
				nextCursor = extra.id
			}
		}

		const productsData = rows.map((product) => ({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			currency: product.currency,
			image: product.image,
			category: product.category,
		}))

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
