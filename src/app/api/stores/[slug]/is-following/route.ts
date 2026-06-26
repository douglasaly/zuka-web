import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: Request) {
	const url = new URL(request.url)
	const slug = url.pathname.split('/')[3]

	const user = await getSessionUser()
	if (!user) {
		return Response.json({ isFollowing: false })
	}

	const supabase = createSupabaseAdmin()

	const { data: store } = await supabase
		.from('stores')
		.select('id')
		.eq('slug', slug)
		.single()

	if (!store) {
		return Response.json({ isFollowing: false })
	}

	const { data } = await supabase
		.from('store_followers')
		.select('id')
		.eq('user_id', user.id)
		.eq('store_id', String(store.id))
		.maybeSingle()

	return Response.json({
		isFollowing: !!data,
	})
}
