import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'

export async function GET(req: Request) {
	await requireAdminUser()
	const { searchParams } = new URL(req.url)
	const search = searchParams.get('search') ?? ''
	const categoryId = searchParams.get('category') ?? ''
	const status = searchParams.get('status') as Database['public']['Enums']['product_status_enum'] | null
	const page = Number(searchParams.get('page') ?? 1)
	const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
	const offset = (page - 1) * limit

	const supabase = createSupabaseAdmin()
	let query = supabase
		.from('products')
		.select('id, name, description, price, discount_price, currency, status, is_visible, created_at, store_id, category_id, stores(id, name, slug), categories(id, name), product_images(url, is_primary)')
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1)

	if (search) query = query.ilike('name', `%${search}%`)
	if (categoryId) query = query.eq('category_id', categoryId)
	if (status) query = query.eq('status', status)

	const { data, error } = await query
	if (error) return NextResponse.json({ error: error.message }, { status: 500 })

	return NextResponse.json({ products: data ?? [] })
}
