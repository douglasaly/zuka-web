import { NextResponse } from 'next/server'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { UserProfile } from '@/types/marketplace'

export async function GET() {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()
		const roles = await getUserRoles(user.id as string)

		const { data: sellerProfile } = await supabase
			.from('seller_profiles')
			.select('id, status')
			.eq('user_id', user.id as string)
			.maybeSingle()

		let onboarding = null
		if (sellerProfile) {
			const { data } = await supabase
				.from('seller_onboarding')
				.select('status, current_step')
				.eq('seller_profile_id', sellerProfile.id as string)
				.maybeSingle()

			if (data) {
				onboarding = {
					status: data.status as string,
					currentStep: data.current_step as string | null,
				}
			}
		}

		const { data: stores } = sellerProfile
			? await supabase
					.from('stores')
					.select('id, name, slug, status')
					.eq('seller_profile_id', sellerProfile.id as string)
					.is('deleted_at', null)
			: { data: [] }

		const storesWithCounts = await Promise.all(
			(stores ?? []).map(async (store) => {
				const { count } = await supabase
					.from('products')
					.select('*', { count: 'exact', head: true })
					.eq('store_id', store.id as string)
					.is('deleted_at', null)

				return {
					id: store.id as string,
					name: store.name as string,
					slug: store.slug as string,
					status: store.status as string | null,
					productCount: count ?? 0,
				}
			})
		)

		const profile: UserProfile = {
			id: user.id as string,
			email: user.email as string | null,
			firstName: user.first_name as string | null,
			lastName: user.last_name as string | null,
			avatarUrl: user.avatar_url as string | null,
			roles,
			sellerProfile: sellerProfile
				? {
						id: sellerProfile.id as string,
						status: sellerProfile.status as string,
					}
				: null,
			stores: storesWithCounts,
			onboarding,
		}

		return NextResponse.json({ success: true, profile })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to load profile' },
			{ status: 500 }
		)
	}
}
