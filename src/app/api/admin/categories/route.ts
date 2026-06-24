import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	await requireAdminUser()
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase.from('categories').select('*').order('name')
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ categories: data ?? [] })
}

export async function POST(req: Request) {
	await requireAdminUser()
	const { name, slug } = await req.json()
	if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase.from('categories').insert({ id: uuidv7(), name, slug: slug || name.toLowerCase().replace(/\s+/g, '-') }).select('*').single()
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ category: data })
}

export async function PATCH(req: Request) {
	await requireAdminUser()
	const { id, name, slug } = await req.json()
	if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

	const supabase = createSupabaseAdmin()
	const { error } = await supabase.from('categories').update({ name, slug }).eq('id', id)
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
	await requireAdminUser()
	const { id } = await req.json()
	if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

	const supabase = createSupabaseAdmin()
	const { error } = await supabase.from('categories').delete().eq('id', id)
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ success: true })
}
