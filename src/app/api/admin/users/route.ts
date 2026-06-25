import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { getUserRoles, assignUserRole } from '@/lib/auth/roles'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: Request) {
	await requireAdminUser()
	const { searchParams } = new URL(req.url)
	const search = searchParams.get('search') ?? ''
	const statusFilter = searchParams.get('status') ?? ''
	const page = Number(searchParams.get('page') ?? 1)
	const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
	const offset = (page - 1) * limit

	const supabase = createSupabaseAdmin()
	let query = supabase
		.from('users')
		.select('id, first_name, last_name, email, phone_number, avatar_url, status, created_at')
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1)

	if (search) query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
	if (statusFilter) query = query.eq('status', statusFilter)

	const { data, error } = await query
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })

	const users = await Promise.all(
		(data ?? []).map(async (user) => {
			const roles = await getUserRoles(user.id as string)
			const { data: store } = await supabase.from('stores').select('id, name, slug, status').eq('owner_id', user.id as string).is('deleted_at', null).maybeSingle()
			return { ...user, roles, store: store ?? null }
		})
	)

	return NextResponse.json({ users })
}
