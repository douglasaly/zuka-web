import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { FollowedStores } from '@/types/stores'
export async function GET(req: Request) {
	const user = await getSessionUser()
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
	const supabase = createSupabaseAdmin()
	const { searchParams } = new URL(req.url)
	const cursor = searchParams.get('cursor')
	const limit = Number(searchParams.get('limit') ?? 8)
	let query = supabase
		.from('store_followers')
		.select(
			`
			followed_at,
			store:store_id!inner (
				id,
				name,
				logo_url,
				slug,
				state,
				status,
				verified_at,
				deleted_at,
				province:province_id (
					name
				)
			)
		`,
			{ count: 'exact' }
		)
		.eq('user_id', user.id)
		.eq('store.status', 'ACTIVE')
		.is('store.deleted_at', null)
		.order('followed_at', { ascending: false })
		.limit(limit)
	if (cursor) {
		query = query.lt('followed_at', cursor)
	}
	const { data, error, count } = await query
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}
	const result = data.map((item) => ({
		followed_at: item.followed_at,
		store: item.store,
	}))
	const nextCursor =
		data.length > 0 ? data[data.length - 1].followed_at : null
	return NextResponse.json<FollowedStores>({
		data: result,
		metaData: {
			total: count ?? 0,
			limit,
			nextCursor,
		},
	})
}
