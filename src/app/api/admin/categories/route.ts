import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

function bustCategoryCache() {
	revalidateTag('categories', 'max')
}
export async function GET() {
	await requireAdminUser()
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('categories')
		.select('*')
		.order('name')
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ categories: data ?? [] })
}
export async function POST(req: Request) {
	await requireAdminUser()
	const { name, slug } = await req.json()
	if (!name)
		return NextResponse.json({ error: 'Name required' }, { status: 400 })
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('categories')
		.insert({
			id: uuidv7(),
			name,
			slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
		})
		.select('*')
		.single()
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	bustCategoryCache()
	return NextResponse.json({ category: data })
}
export async function PATCH(req: Request) {
	await requireAdminUser()
	const { id, name, slug } = await req.json()
	if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
	const supabase = createSupabaseAdmin()
	const { error } = await supabase
		.from('categories')
		.update({ name, slug })
		.eq('id', id)
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	bustCategoryCache()
	return NextResponse.json({ success: true })
}
export async function DELETE(req: Request) {
	await requireAdminUser()
	const { id } = await req.json()
	if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
	const supabase = createSupabaseAdmin()
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
	const now = new Date().toISOString()
	await supabase
		.from('categories')
		.update({ parent_id: null, updated_at: now })
		.eq('parent_id', id)
		.is('deleted_at', null)
	const { error } = await supabase
		.from('categories')
		.update({ deleted_at: now, updated_at: now })
		.eq('id', id)
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	bustCategoryCache()
	return NextResponse.json({ success: true })
}
