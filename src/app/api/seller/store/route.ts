import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { isR2PublicUrl } from '@/lib/storage/r2'
import type { Database } from '@/lib/supabase/types'

export async function PATCH(request: Request) {
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
			logoUrl,
			bannerUrl,
			description,
			phone,
			whatsapp,
			hasDelivery,
			currentStep,
		} = body

		const supabase = createSupabaseAdmin()

		const { data: sellerProfile } = await supabase
			.from('seller_profiles')
			.select('id')
			.eq('user_id', user.id as string)
			.maybeSingle()

		if (!sellerProfile) {
			return NextResponse.json(
				{ error: 'Seller profile not found' },
				{ status: 404 }
			)
		}

		const { data: store } = await supabase
			.from('stores')
			.select('id')
			.eq('seller_profile_id', sellerProfile.id as string)
			.is('deleted_at', null)
			.maybeSingle()

		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		if (logoUrl && !isR2PublicUrl(logoUrl)) {
			return NextResponse.json(
				{ error: 'O logo deve ser carregado para o armazenamento' },
				{ status: 400 }
			)
		}

		if (bannerUrl && !isR2PublicUrl(bannerUrl)) {
			return NextResponse.json(
				{ error: 'O banner deve ser carregado para o armazenamento' },
				{ status: 400 }
			)
		}

		const updates: Record<string, unknown> = {
			updated_at: new Date().toISOString(),
		}

		if (logoUrl !== undefined) updates.logo_url = logoUrl
		if (bannerUrl !== undefined) updates.banner_url = bannerUrl
		if (description !== undefined) updates.description = description
		if (phone !== undefined) updates.phone = phone
		if (whatsapp !== undefined) updates.whatsapp = whatsapp

		const { data: updatedStore, error: storeError } = await supabase
			.from('stores')
			.update(updates as Database['public']['Tables']['stores']['Update'])
			.eq('id', store.id as string)
			.select('*')
			.single()

		if (storeError) throw storeError

		if (currentStep || hasDelivery !== undefined) {
			const { data: onboarding } = await supabase
				.from('seller_onboarding')
				.select('id')
				.eq('seller_profile_id', sellerProfile.id as string)
				.maybeSingle()

			if (onboarding) {
				const onboardingUpdates: Record<string, unknown> = {
					updated_at: new Date().toISOString(),
				}
				if (currentStep) onboardingUpdates.current_step = currentStep

				await supabase
					.from('seller_onboarding')
					.update(
						onboardingUpdates as Database['public']['Tables']['seller_onboarding']['Update']
					)
					.eq('id', onboarding.id as string)

				if (hasDelivery !== undefined) {
					await supabase.from('seller_onboarding_steps').insert({
						id: uuidv7(),
						onboarding_id: onboarding.id as string,
						step: 'STORE_PROFILE',
						data: { hasDelivery },
						completed: true,
					})
				}
			}
		}

		return NextResponse.json({ success: true, store: updatedStore })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to update store' },
			{ status: 500 }
		)
	}
}
