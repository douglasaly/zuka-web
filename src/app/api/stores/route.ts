import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { ensureSellerProfile, getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { mapStoreRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { Slug } from '@/utils/slug'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const search = searchParams.get('search')
		const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)

		const supabase = createSupabaseAdmin()
		let query = supabase
			.from('stores')
			.select('*, provinces(name)')
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(limit)

		if (search) {
			query = query.ilike('name', `%${search}%`)
		}

		const { data, error } = await query
		if (error) throw error

		const rows = (data ?? []) as Array<Record<string, unknown>>

		const stores = await Promise.all(
			rows.map(async (store) => {
				const storeId = String(store.id)
				const { count: productCount } = await supabase
					.from('products')
					.select('*', { count: 'exact', head: true })
					.eq('store_id', storeId)
					.is('deleted_at', null)

				const { count: followerCount } = await supabase
					.from('store_followers')
					.select('*', { count: 'exact', head: true })
					.eq('store_id', storeId)

				return mapStoreRow({
					...(store as Parameters<typeof mapStoreRow>[0]),
					product_count: productCount ?? 0,
					follower_count: followerCount ?? 0,
				})
			})
		)

		return NextResponse.json({ success: true, stores })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load stores' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const body = await request.json()
		const {
			name,
			description,
			provinceId,
			categoryId,
			neighborhood,
			email,
			phone,
			whatsapp,
		} = body

		if (!name || !provinceId || !neighborhood) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			)
		}

		const sellerProfile = await ensureSellerProfile(user.id as string)
		const supabase = createSupabaseAdmin()

		let slug = Slug(name)
		const { data: slugConflict } = await supabase
			.from('stores')
			.select('id')
			.eq('slug', slug)
			.maybeSingle()

		if (slugConflict) {
			slug = `${slug}-${uuidv7().slice(0, 6)}`
		}

		const { data: store, error } = await supabase
			.from('stores')
			.insert({
				id: uuidv7(),
				owner_id: user.id as string,
				seller_profile_id: sellerProfile.id as string,
				name,
				slug,
				description: description ?? null,
				province_id: provinceId,
				main_store_category_id: categoryId ?? null,
				state: neighborhood,
				email: email ?? user.email,
				phone: phone ?? user.phone_number,
				whatsapp: whatsapp ?? phone ?? user.phone_number,
				status: 'PENDING',
			})
			.select('*')
			.single()

		if (error) throw error

		await supabase
			.from('seller_onboarding')
			.update({
				current_step: 'STORE_PROFILE',
				status: 'DRAFT',
				updated_at: new Date().toISOString(),
			})
			.eq('seller_profile_id', sellerProfile.id as string)

		return NextResponse.json({ success: true, store })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to create store' },
			{ status: 500 }
		)
	}
}
