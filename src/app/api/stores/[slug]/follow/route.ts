import { uuidv7 } from 'uuidv7'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
	const url = new URL(request.url)
	const slug = url.pathname.split('/')[3]

	const user = await getSessionUser()
	if (!user) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const supabase = createSupabaseAdmin()

	const { data: store } = await supabase
		.from('stores')
		.select('id')
		.eq('slug', slug)
		.single()

	if (!store) {
		return Response.json({ error: 'Store not found' }, { status: 404 })
	}

	const { error } = await supabase.from('store_followers').upsert(
		{
			id: uuidv7(),
			user_id: user.id,
			store_id: store.id,
		},
		{ onConflict: 'user_id,store_id', ignoreDuplicates: true }
	)

	if (error) {
		return Response.json({ error: 'Failed to follow' }, { status: 500 })
	}
	return Response.json({
		success: true,
		action: 'followed',
	})
}

export async function DELETE(request: Request) {
	const url = new URL(request.url)
	const slug = url.pathname.split('/')[3]

	const user = await getSessionUser()
	if (!user) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const supabase = createSupabaseAdmin()

	const { data: store } = await supabase
		.from('stores')
		.select('id')
		.eq('slug', slug)
		.single()

	if (!store) {
		return Response.json({ error: 'Store not found' }, { status: 404 })
	}

	await supabase
		.from('store_followers')
		.delete()
		.eq('user_id', user.id)
		.eq('store_id', String(store.id))

	return Response.json({
		success: true,
		action: 'unfollowed',
	})
}
