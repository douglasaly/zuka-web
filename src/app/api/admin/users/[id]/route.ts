import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { getUserRoles, assignUserRole } from '@/lib/auth/roles'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const supabase = createSupabaseAdmin()

	const { data: user, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

	const roles = await getUserRoles(id)
	const { data: store } = await supabase.from('stores').select('*').eq('owner_id', id).is('deleted_at', null).maybeSingle()

	return NextResponse.json({ user: { ...user, roles }, store })
}

export async function PATCH(req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const body = await req.json()
	const supabase = createSupabaseAdmin()

	const { makeAdmin, removeAdmin, status } = body

	if (makeAdmin) {
		await assignUserRole(id, 'admin')
	}
	if (removeAdmin) {
		// Remove admin role from user_roles
		const { data: adminRole } = await supabase.from('roles').select('id').eq('name', 'admin').maybeSingle()
		if (adminRole) {
			await supabase.from('user_roles').delete().eq('user_id', id).eq('role_id', adminRole.id as string)
		}
	}
	if (status) {
		const { error } = await supabase.from('users').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
		if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ success: true })
}

export async function DELETE(_req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const supabase = createSupabaseAdmin()

	const { error } = await supabase.from('users').update({ deleted_at: new Date().toISOString(), status: 'DELETED' }).eq('id', id)
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ success: true })
}
