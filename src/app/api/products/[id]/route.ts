import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema/categories'
import { productImages } from '@/db/schema/product-images'
import { products } from '@/db/schema/products'
import { stores } from '@/db/schema/stores'

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		if (!id) {
			return NextResponse.json(
				{ success: false, message: 'ID not provided.' },
				{ status: 400 }
			)
		}

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
			.where(eq(products.id, id))

		if (!rows.length) {
			return NextResponse.json(
				{ success: false, message: 'Produto não encontrado' },
				{ status: 404 }
			)
		}

		const base = rows[0]

		const images = rows.map((r) => r.image).filter(Boolean)

		const data = {
			product: base.product,
			store: base.store,
			category: base.category,
			images,
		}

		return NextResponse.json({
			success: true,
			data,
		})
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar produto',
			},
			{ status: 500 }
		)
	}
}
