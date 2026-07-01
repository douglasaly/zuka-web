import { NextResponse } from 'next/server'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const supabase = createSupabaseAdmin()

	const { data: store, error } = await supabase
		.from('stores')
		.select(`
			*,
			provinces(name),
			categories:main_store_category_id(id, name),
			users:owner_id(id, first_name, last_name, email, phone_number, created_at, avatar_url)
		`)
		.eq('id', id)
		.maybeSingle()

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	if (!store)
		return NextResponse.json({ error: 'Not found' }, { status: 404 })

	const { data: docs } = await supabase
		.from('verification_documents')
		.select('*')
		.eq('store_id', id)
		.is('deleted_at', null)
	const { data: products } = await supabase
		.from('products')
		.select('*, categories(name), product_images(url, is_primary)')
		.eq('store_id', id)
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.limit(50)
	const { count: followerCount } = await supabase
		.from('store_followers')
		.select('*', { count: 'exact', head: true })
		.eq('store_id', id)

	return NextResponse.json({
		store: { ...(store as object), followerCount },
		docs,
		products,
	})
}

export async function PATCH(req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const body = await req.json()
	const supabase = createSupabaseAdmin()

	const { status, rejectionReason, ...rest } = body

	const updates: Record<string, unknown> = {
		...rest,
		updated_at: new Date().toISOString(),
	}
	if (status) updates.status = status
	if (status === 'ACTIVE') updates.verified_at = new Date().toISOString()

	const { data, error } = await supabase
		.from('stores')
		.update(updates as Database['public']['Tables']['stores']['Update'])
		.eq('id', id)
		.select('*')
		.single()
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })

	// Update seller onboarding status
	if (status === 'ACTIVE' || status === 'REJECTED') {
		const { data: storeRow } = await supabase
			.from('stores')
			.select('seller_profile_id')
			.eq('id', id)
			.maybeSingle()
		if (storeRow?.seller_profile_id) {
			await supabase
				.from('seller_onboarding')
				.update({
					status: status === 'ACTIVE' ? 'APPROVED' : 'REJECTED',
					approved_at:
						status === 'ACTIVE' ? new Date().toISOString() : null,
					updated_at: new Date().toISOString(),
				})
				.eq('seller_profile_id', storeRow.seller_profile_id as string)
		}
	}

	return NextResponse.json({ store: data })
}

export async function DELETE(_req: Request, { params }: Params) {
	await requireAdminUser()
	const { id } = await params
	const supabase = createSupabaseAdmin()

	const { error } = await supabase
		.from('stores')
		.update({ deleted_at: new Date().toISOString() })
		.eq('id', id)
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 })
	return NextResponse.json({ success: true })
}
