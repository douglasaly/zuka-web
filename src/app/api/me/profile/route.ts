import { NextResponse } from 'next/server'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { UserProfile } from '@/types/marketplace'

export async function PATCH(request: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { firstName, lastName, phoneNumber, avatarUrl } = body

		const supabase = createSupabaseAdmin()

		const updates: Record<string, unknown> = {}

		if (typeof firstName === 'string') updates.first_name = firstName
		if (typeof lastName === 'string') updates.last_name = lastName
		if (typeof phoneNumber === 'string') updates.phone_number = phoneNumber
		if (typeof avatarUrl === 'string') updates.avatar_url = avatarUrl

		updates.updated_at = new Date().toISOString()

		const { data: updatedUser, error } = await supabase
			.from('users')
			.update(updates)
			.eq('id', user.id as string)
			.select('*')
			.single()

		if (error) {
			console.error('[PATCH /api/me/profile]', error)
			return NextResponse.json(
				{ error: 'Failed to update profile' },
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			profile: {
				id: updatedUser.id as string,
				email: updatedUser.email as string | null,
				firstName: updatedUser.first_name as string | null,
				lastName: updatedUser.last_name as string | null,
				avatarUrl: updatedUser.avatar_url as string | null,
				phoneNumber: updatedUser.phone_number,
			},
		})
	} catch (error) {
		console.error('[PATCH /api/me/profile]', error)
		return NextResponse.json(
			{ error: 'Failed to update profile' },
			{ status: 500 }
		)
	}
}

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
			phoneNumber: user.phone_number,
			emailVerified: user.email_verified,
			phoneVerified: user.phone_verified,
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
