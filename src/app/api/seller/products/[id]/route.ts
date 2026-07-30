import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireSellerStore } from '@/lib/auth/seller'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

const VISIBLE_STATUSES = new Set(['ACTIVE', 'OUT_OF_STOCK'])

export async function GET(_req: Request, { params }: Params) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { id } = await params
		const { store } = auth
		const supabase = createSupabaseAdmin()

		const { data, error } = await supabase
			.from('products')
			.select(
				'*, categories(id, name), product_images(id, url, position, is_primary), product_stock(quantity)'
			)
			.eq('id', id)
			.eq('store_id', store.id as string)
			.is('deleted_at', null)
			.maybeSingle()

		if (error) throw error
		if (!data) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 }
			)
		}

		const record = data as Record<string, unknown>
		const images = (
			(record.product_images as Array<{
				id: string
				url: string
				position: number | null
				is_primary: boolean | null
			}> | null) ?? []
		)
			.filter((img) => Boolean(img.url))
			.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

		const stockRows = record.product_stock as
			| Array<{ quantity: number }>
			| { quantity: number }
			| null
		const quantity = Array.isArray(stockRows)
			? (stockRows[0]?.quantity ?? 0)
			: (stockRows?.quantity ?? 0)

		const cat = record.categories as { id: string; name: string } | null

		return NextResponse.json({
			success: true,
			product: {
				id: record.id as string,
				name: record.name as string,
				description: (record.description as string | null) ?? null,
				categoryId: (record.category_id as string) ?? cat?.id ?? '',
				categoryName: cat?.name ?? null,
				price: (record.price as number) / 100,
				discountPrice:
					record.discount_price != null
						? (record.discount_price as number) / 100
						: null,
				currency: record.currency as string,
				quantity,
				status: record.status as string,
				isVisible: record.is_visible as boolean,
				images: images.map((img) => ({
					id: img.id,
					url: img.url,
					position: img.position ?? 0,
					isPrimary: Boolean(img.is_primary),
				})),
			},
		})
	} catch (error) {
		console.error('[GET /api/seller/products/:id]', error)
		return NextResponse.json(
			{ error: 'Erro ao carregar produto' },
			{ status: 500 }
		)
	}
}

export async function PATCH(req: Request, { params }: Params) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { id } = await params
		const { store } = auth
		const body = await req.json()

		const supabase = createSupabaseAdmin()

		const { data: existing } = await supabase
			.from('products')
			.select('id')
			.eq('id', id)
			.eq('store_id', store.id as string)
			.is('deleted_at', null)
			.maybeSingle()

		if (!existing) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 }
			)
		}

		const imageUrls: string[] | undefined = Array.isArray(body.imageUrls)
			? body.imageUrls
			: body.imageUrl
				? [body.imageUrl]
				: undefined

		if (imageUrls?.some((url) => url && !isR2PublicUrl(url))) {
			return NextResponse.json(
				{ error: 'A imagem deve ser carregada primeiro' },
				{ status: 400 }
			)
		}

		const updates: Record<string, unknown> = {
			updated_at: new Date().toISOString(),
		}

		if (body.name !== undefined) updates.name = body.name
		if (body.description !== undefined)
			updates.description = body.description
		if (body.categoryId !== undefined) updates.category_id = body.categoryId
		if (body.price !== undefined)
			updates.price = Math.round(Number(body.price) * 100)
		if (body.discountPrice !== undefined)
			updates.discount_price =
				body.discountPrice != null && body.discountPrice !== ''
					? Math.round(Number(body.discountPrice) * 100)
					: null
		if (body.status !== undefined) {
			updates.status = body.status
			if (body.isVisible === undefined) {
				updates.is_visible = VISIBLE_STATUSES.has(body.status)
			}
		}
		if (body.isVisible !== undefined) updates.is_visible = body.isVisible

		const { error } = await supabase
			.from('products')
			.update(updates as never)
			.eq('id', id)

		if (error) throw error

		if (body.quantity !== undefined) {
			const qty = Number(body.quantity) || 0
			const { data: stock } = await supabase
				.from('product_stock')
				.select('id')
				.eq('product_id', id)
				.maybeSingle()

			if (stock) {
				await supabase
					.from('product_stock')
					.update({
						quantity: qty,
						updated_at: new Date().toISOString(),
					})
					.eq('id', stock.id as string)
			} else {
				await supabase.from('product_stock').insert({
					id: uuidv7(),
					product_id: id,
					quantity: qty,
					reserved: 0,
				})
			}
		}

		if (imageUrls) {
			await supabase.from('product_images').delete().eq('product_id', id)

			if (imageUrls.length > 0) {
				await supabase.from('product_images').insert(
					imageUrls.map((url, index) => ({
						id: uuidv7(),
						product_id: id,
						url,
						position: index,
						is_primary: index === 0,
						alt: typeof body.name === 'string' ? body.name : null,
					}))
				)
			}
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[PATCH /api/seller/products/:id]', error)
		return NextResponse.json(
			{ error: 'Erro ao actualizar produto' },
			{ status: 500 }
		)
	}
}

export async function DELETE(_req: Request, { params }: Params) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { id } = await params
		const { store } = auth
		const supabase = createSupabaseAdmin()

		const { data: existing } = await supabase
			.from('products')
			.select('id')
			.eq('id', id)
			.eq('store_id', store.id as string)
			.is('deleted_at', null)
			.maybeSingle()

		if (!existing) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 }
			)
		}

		const { error } = await supabase
			.from('products')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id)

		if (error) throw error

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[DELETE /api/seller/products/:id]', error)
		return NextResponse.json(
			{ error: 'Erro ao eliminar produto' },
			{ status: 500 }
		)
	}
}
