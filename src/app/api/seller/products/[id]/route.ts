import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireSellerStore } from '@/lib/auth/seller'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

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

		if (body.imageUrl && !isR2PublicUrl(body.imageUrl)) {
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
				body.discountPrice != null
					? Math.round(Number(body.discountPrice) * 100)
					: null
		if (body.quantity !== undefined) updates.quantity = body.quantity
		if (body.status !== undefined) updates.status = body.status
		if (body.isVisible !== undefined) updates.is_visible = body.isVisible

		const { error } = await supabase
			.from('products')
			.update(updates as any)
			.eq('id', id)

		if (error) throw error

		if (body.imageUrl) {
			await supabase
				.from('product_images')
				.update({ is_primary: false })
				.eq('product_id', id)

			const { data: existingImage } = await supabase
				.from('product_images')
				.select('id')
				.eq('product_id', id)
				.eq('url', body.imageUrl)
				.maybeSingle()

			if (!existingImage) {
				await supabase.from('product_images').insert({
					id: uuidv7(),
					product_id: id,
					url: body.imageUrl,
					is_primary: true,
				})
			} else {
				await supabase
					.from('product_images')
					.update({ is_primary: true })
					.eq('id', existingImage.id)
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
