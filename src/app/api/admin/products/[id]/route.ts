import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const body = await req.json()
	const supabase = createSupabaseAdmin()

	const { error } = await supabase
		.from('products')
		.update({ ...body, updated_at: new Date().toISOString() })
		.eq('id', id)
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ success: true })
}

export async function DELETE(_req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const supabase = createSupabaseAdmin()

	const { error } = await supabase
		.from('products')
		.update({ deleted_at: new Date().toISOString() })
		.eq('id', id)
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ success: true })
}
