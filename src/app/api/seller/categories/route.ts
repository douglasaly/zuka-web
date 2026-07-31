import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { Slug } from '@/utils/slug'

type CategoryUpdate = Database['public']['Tables']['categories']['Update']

function mapCategory(row: Record<string, unknown>) {
	return {
		id: row.id as string,
		parentId: (row.parent_id as string | null) ?? null,
		name: row.name as string,
		slug: row.slug as string,
		position: (row.position as number | null) ?? 0,
		createdAt: (row.created_at as string | null) ?? null,
		updatedAt: (row.updated_at as string | null) ?? null,
	}
}

export async function GET() {
	try {
		const auth = await requireSellerStore({ permission: 'product.read' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('categories')
			.select(
				'id, parent_id, name, slug, position, created_at, updated_at'
			)
			.is('deleted_at', null)
			.order('position', { ascending: true })
			.order('name', { ascending: true })

		if (error) throw error

		return NextResponse.json({
			success: true,
			categories: (data ?? []).map((row) =>
				mapCategory(row as Record<string, unknown>)
			),
		})
	} catch (error) {
		console.error('[GET /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao carregar categorias' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const body = await request.json()
		const name = typeof body.name === 'string' ? body.name.trim() : ''
		const parentId =
			typeof body.parentId === 'string' && body.parentId
				? body.parentId
				: null

		if (!name) {
			return NextResponse.json(
				{ error: 'Nome é obrigatório' },
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()
		let slug =
			typeof body.slug === 'string' && body.slug.trim()
				? Slug(body.slug)
				: Slug(name)

		if (!slug) {
			return NextResponse.json(
				{ error: 'Slug inválido' },
				{ status: 400 }
			)
		}

		const { data: conflict } = await supabase
			.from('categories')
			.select('id')
			.eq('slug', slug)
			.is('deleted_at', null)
			.maybeSingle()

		if (conflict) {
			slug = `${slug}-${uuidv7().slice(0, 6)}`
		}

		let siblingsQuery = supabase
			.from('categories')
			.select('position')
			.is('deleted_at', null)
			.order('position', { ascending: false })
			.limit(1)

		siblingsQuery = parentId
			? siblingsQuery.eq('parent_id', parentId)
			: siblingsQuery.is('parent_id', null)

		const { data: siblings } = await siblingsQuery
		const position = ((siblings?.[0]?.position as number) ?? -1) + 1

		const { data, error } = await supabase
			.from('categories')
			.insert({
				id: uuidv7(),
				name,
				slug,
				parent_id: parentId,
				position,
			})
			.select(
				'id, parent_id, name, slug, position, created_at, updated_at'
			)
			.single()

		if (error) throw error

		return NextResponse.json({
			success: true,
			category: mapCategory(data as Record<string, unknown>),
		})
	} catch (error) {
		console.error('[POST /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao criar categoria' },
			{ status: 500 }
		)
	}
}

export async function PATCH(request: Request) {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const body = await request.json()

		// Reorder batch: { items: [{ id, position, parentId? }] }
		if (Array.isArray(body.items)) {
			const supabase = createSupabaseAdmin()
			const now = new Date().toISOString()

			for (const item of body.items) {
				if (!item?.id) continue
				const updates: CategoryUpdate = {
					updated_at: now,
				}
				if (typeof item.position === 'number') {
					updates.position = item.position
				}
				if (item.parentId !== undefined) {
					updates.parent_id = item.parentId || null
				}
				await supabase
					.from('categories')
					.update(updates)
					.eq('id', item.id as string)
					.is('deleted_at', null)
			}

			return NextResponse.json({ success: true })
		}

		const id = typeof body.id === 'string' ? body.id : ''
		if (!id) {
			return NextResponse.json(
				{ error: 'ID é obrigatório' },
				{ status: 400 }
			)
		}

		const updates: CategoryUpdate = {
			updated_at: new Date().toISOString(),
		}

		if (typeof body.name === 'string' && body.name.trim()) {
			updates.name = body.name.trim()
		}
		if (typeof body.slug === 'string' && body.slug.trim()) {
			updates.slug = Slug(body.slug)
		}
		if (body.parentId !== undefined) {
			updates.parent_id = body.parentId || null
		}
		if (typeof body.position === 'number') {
			updates.position = body.position
		}

		const supabase = createSupabaseAdmin()
		const { error } = await supabase
			.from('categories')
			.update(updates)
			.eq('id', id)
			.is('deleted_at', null)

		if (error) throw error

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[PATCH /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao actualizar categoria' },
			{ status: 500 }
		)
	}
}

export async function DELETE(request: Request) {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const body = await request.json()
		const id = typeof body.id === 'string' ? body.id : ''
		if (!id) {
			return NextResponse.json(
				{ error: 'ID é obrigatório' },
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()
		const now = new Date().toISOString()

		const { count } = await supabase
			.from('products')
			.select('id', { count: 'exact', head: true })
			.eq('category_id', id)
			.is('deleted_at', null)

		if ((count ?? 0) > 0) {
			return NextResponse.json(
				{
					error: 'Existem produtos nesta categoria. Mova-os antes de eliminar.',
				},
				{ status: 400 }
			)
		}

		await supabase
			.from('categories')
			.update({ parent_id: null, updated_at: now })
			.eq('parent_id', id)
			.is('deleted_at', null)

		const { error } = await supabase
			.from('categories')
			.update({ deleted_at: now, updated_at: now })
			.eq('id', id)

		if (error) throw error

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[DELETE /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao eliminar categoria' },
			{ status: 500 }
		)
	}
}
