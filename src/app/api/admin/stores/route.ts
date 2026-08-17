import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { withErrorHandling } from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { AdminListQuerySchema, sanitizeIlikeTerm } from '@/lib/validations'

type StoreStatus = Database['public']['Enums']['store_status']

const STORE_STATUSES = new Set<StoreStatus>([
	'ACTIVE',
	'INACTIVE',
	'BANNED',
	'PENDING',
	'SUSPENDED',
])

function nestedCount(value: unknown): number {
	if (!Array.isArray(value)) return 0
	const first = value[0] as { count?: number } | undefined
	return first?.count ?? 0
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
		.from('stores')
		.select(
			`
			id, name, slug, status, description, logo_url, banner_url, phone, whatsapp, email, state, created_at,
			provinces(name),
			categories:main_store_category_id(id, name),
			users:owner_id(id, first_name, last_name, email, phone_number, created_at),
			product_count:products(count),
			follower_count:store_followers(count)
		`
		)
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.range(offset, offset + params.limit - 1)
	if (params.status && STORE_STATUSES.has(params.status as StoreStatus)) {
		query = query.eq('status', params.status as StoreStatus)
	}
	if (search) query = query.ilike('name', `%${search}%`)
	const { data, error } = await query
	if (error) throw error
	const stores = (data ?? []).map((store) => {
		const { product_count, follower_count, ...rest } = store
		return {
			...rest,
			productCount: nestedCount(product_count),
			followerCount: nestedCount(follower_count),
		}
	})
	return NextResponse.json({ stores })
})
