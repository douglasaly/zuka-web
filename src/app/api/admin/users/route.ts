import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { withErrorHandling } from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { AdminListQuerySchema, sanitizeIlikeTerm } from '@/lib/validations'

type RoleEmbed = { name?: string } | { name?: string }[] | null

function embedRoleName(roles: RoleEmbed): string | undefined {
	if (Array.isArray(roles)) return roles[0]?.name
	return roles?.name
}

export const GET = withErrorHandling(async (request: NextRequest) => {
	await requireAdminUser()
	const { searchParams } = new URL(request.url)
	const parsed = AdminListQuerySchema.safeParse({
		search: searchParams.get('search') ?? undefined,
		status: searchParams.get('status') ?? undefined,
		page: searchParams.get('page') ?? undefined,
		limit: searchParams.get('limit') ?? undefined,
	})
	const params = parsed.success
		? parsed.data
		: { search: '', status: '', page: 1, limit: 50 }
	const search = sanitizeIlikeTerm(params.search)
	const offset = (params.page - 1) * params.limit
	const supabase = createSupabaseAdmin()
	let query = supabase
		.from('users')
		.select(
			'id, first_name, last_name, email, phone_number, avatar_url, status, created_at'
		)
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.range(offset, offset + params.limit - 1)
	if (search) {
		query = query.or(
			`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
		)
	}
	if (params.status) query = query.eq('status', params.status)
	const { data, error } = await query
	if (error) throw error
	const users = data ?? []
	const userIds = users.map((user) => user.id)
	if (userIds.length === 0) {
		return NextResponse.json({ users: [] })
	}
	const [rolesResult, storesResult] = await Promise.all([
		supabase
			.from('user_roles')
			.select('user_id, roles(name)')
			.in('user_id', userIds),
		supabase
			.from('stores')
			.select('id, name, slug, status, owner_id')
			.in('owner_id', userIds)
			.is('deleted_at', null),
	])
	if (rolesResult.error) throw rolesResult.error
	if (storesResult.error) throw storesResult.error
	const rolesByUser = new Map<string, string[]>()
	for (const row of rolesResult.data ?? []) {
		const name = embedRoleName(row.roles as RoleEmbed)
		if (!name) continue
		const list = rolesByUser.get(row.user_id) ?? []
		list.push(name)
		rolesByUser.set(row.user_id, list)
	}
	const storeByOwner = new Map<string, (typeof storesResult.data)[number]>()
	for (const store of storesResult.data ?? []) {
		if (!storeByOwner.has(store.owner_id)) {
			storeByOwner.set(store.owner_id, store)
		}
	}
	return NextResponse.json({
		users: users.map((user) => ({
			...user,
			roles: rolesByUser.get(user.id) ?? [],
			store: storeByOwner.get(user.id) ?? null,
		})),
	})
})
