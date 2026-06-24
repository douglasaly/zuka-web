import { NextResponse } from 'next/server'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { mapOrderRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const supabase = createSupabaseAdmin()

		const { data: sellerProfile } = await supabase
			.from('seller_profiles')
			.select('id')
			.eq('user_id', user.id as string)
			.maybeSingle()

		if (!sellerProfile) {
			return NextResponse.json({ success: true, orders: [] })
		}

		const { data: stores } = await supabase
			.from('stores')
			.select('id')
			.eq('seller_profile_id', sellerProfile.id as string)
			.is('deleted_at', null)

		const storeIds = (stores ?? []).map((s) => s.id as string)
		if (storeIds.length === 0) {
			return NextResponse.json({ success: true, orders: [] })
		}

		const { data, error } = await supabase
			.from('orders')
			.select('*, stores(name, logo_url)')
			.in('store_id', storeIds)
			.order('created_at', { ascending: false })

		if (error) throw error

		const orders = ((data ?? []) as Array<Record<string, unknown>>).map((row) =>
			mapOrderRow({
				id: row.id as string,
				total: row.total as number,
				currency: row.currency as string,
				item_count: row.item_count as number,
				status: row.status as string,
				created_at: row.created_at as string,
				stores: row.stores as { name: string; logo_url?: string | null },
			})
		)

		return NextResponse.json({ success: true, orders })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load seller orders' },
			{ status: 500 }
		)
	}
}
