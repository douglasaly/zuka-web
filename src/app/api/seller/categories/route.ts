import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

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

const SELLER_CATEGORY_MUTATION_FORBIDDEN = NextResponse.json(
	{
		error: 'Apenas administradores podem gerir categorias da plataforma.',
	},
	{ status: 403 }
)

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

export async function POST() {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error
		return SELLER_CATEGORY_MUTATION_FORBIDDEN
	} catch (error) {
		console.error('[POST /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao criar categoria' },
			{ status: 500 }
		)
	}
}

export async function PATCH() {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error
		return SELLER_CATEGORY_MUTATION_FORBIDDEN
	} catch (error) {
		console.error('[PATCH /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao actualizar categoria' },
			{ status: 500 }
		)
	}
}

export async function DELETE() {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error
		return SELLER_CATEGORY_MUTATION_FORBIDDEN
	} catch (error) {
		console.error('[DELETE /api/seller/categories]', error)
		return NextResponse.json(
			{ error: 'Falha ao eliminar categoria' },
			{ status: 500 }
		)
	}
}
