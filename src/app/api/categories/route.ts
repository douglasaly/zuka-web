import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Category } from './types'

export async function GET() {
	try {
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.is('deleted_at', null)
			.order('name')

		if (error) {
			throw error
		}

		const mapped: Category[] = (data ?? []).map((category) => ({
			id: String(category.id),
			parentId: category.parent_id ? String(category.parent_id) : null,
			name: String(category.name),
			slug: String(category.slug),
			createdAt: category.created_at ? String(category.created_at) : null,
			updatedAt: category.updated_at ? String(category.updated_at) : null,
			deletedAt: category.deleted_at ? String(category.deleted_at) : null,
		}))

		return NextResponse.json<Category[]>(mapped)
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar categorias',
			},
			{ status: 500 }
		)
	}
}

export async function POST() {}
