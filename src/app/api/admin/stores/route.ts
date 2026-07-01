import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'

export async function GET(req: Request) {
	await requireAdminUser()
	const { searchParams } = new URL(req.url)
	const status = searchParams.get('status')
	const search = searchParams.get('search') ?? ''
	const page = Number(searchParams.get('page') ?? 1)
	const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
	const offset = (page - 1) * limit

	const supabase = createSupabaseAdmin()

	let query = supabase
		.from('stores')
		.select(`
			id, name, slug, status, description, logo_url, banner_url, phone, whatsapp, email, state, created_at,
			provinces(name),
			categories:main_store_category_id(id, name),
			users:owner_id(id, first_name, last_name, email, phone_number, created_at)
		`)
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1)

	if (status) query = query.eq('status', status as Database['public']['Enums']['store_status'])
	if (search) query = query.ilike('name', `%${search}%`)

	const { data, error } = await query
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })

	const storesWithCounts = await Promise.all(
		(data ?? []).map(async (store) => {
			const sid = (store as unknown as Record<string, unknown>).id as string
			const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', sid).is('deleted_at', null)
			const { count: followerCount } = await supabase.from('store_followers').select('*', { count: 'exact', head: true }).eq('store_id', sid)
			return { ...(store as object), productCount: productCount ?? 0, followerCount: followerCount ?? 0 }
		})
	)

	return NextResponse.json({ stores: storesWithCounts })
}
