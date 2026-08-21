import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import {
	apiError,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { UpdateProfileSchema } from '@/lib/validations'
import type { UserProfile } from '@/types'

function nestedCount(value: unknown): number {
	if (!Array.isArray(value)) return 0
	const first = value[0] as { count?: number } | undefined
	return first?.count ?? 0
}

export const PATCH = withErrorHandling(async (request: NextRequest) => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const parsed = UpdateProfileSchema.safeParse(await request.json())
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0]?.message ?? 'Dados inválidos'
		)
	}
	const { firstName, lastName, phoneNumber, avatarUrl } = parsed.data
	const updates: Record<string, unknown> = {
		updated_at: new Date().toISOString(),
	}
	if (firstName !== undefined) updates.first_name = firstName
	if (lastName !== undefined) updates.last_name = lastName
	if (phoneNumber !== undefined) updates.phone_number = phoneNumber
	if (avatarUrl !== undefined) updates.avatar_url = avatarUrl
	const hasField = Object.keys(updates).some((key) => key !== 'updated_at')
	if (!hasField) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			'Nenhum campo válido para actualizar'
		)
	}
	const supabase = createSupabaseAdmin()
	const { data: updatedUser, error } = await supabase
		.from('users')
		.update(updates as never)
		.eq('id', user.id as string)
		.select('id, email, first_name, last_name, avatar_url, phone_number')
		.single()
	if (error) throw error
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
})

export const GET = withErrorHandling(async () => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const supabase = createSupabaseAdmin()
	const [roles, sellerResult] = await Promise.all([
		getUserRoles(user.id as string),
		supabase
			.from('seller_profiles')
			.select('id, status')
			.eq('user_id', user.id as string)
			.maybeSingle(),
	])
	if (sellerResult.error) throw sellerResult.error
	const sellerProfile = sellerResult.data
	let onboarding: UserProfile['onboarding'] = null
	let storesWithCounts: UserProfile['stores'] = []
	if (sellerProfile) {
		const [onboardingResult, storesResult] = await Promise.all([
			supabase
				.from('seller_onboarding')
				.select('status, current_step')
				.eq('seller_profile_id', sellerProfile.id)
				.maybeSingle(),
			supabase
				.from('stores')
				.select('id, name, slug, status, product_count:products(count)')
				.eq('seller_profile_id', sellerProfile.id)
				.is('deleted_at', null),
		])
		if (onboardingResult.error) throw onboardingResult.error
		if (storesResult.error) throw storesResult.error
		if (onboardingResult.data) {
			onboarding = {
				status: onboardingResult.data.status as string,
				currentStep: onboardingResult.data.current_step as
					| string
					| null,
			}
		}
		storesWithCounts = (storesResult.data ?? []).map((store) => ({
			id: store.id,
			name: store.name,
			slug: store.slug,
			status: store.status,
			productCount: nestedCount(store.product_count),
		}))
	}
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
					id: sellerProfile.id,
					status: sellerProfile.status as string,
				}
			: null,
		stores: storesWithCounts,
		onboarding,
	}
	return NextResponse.json({ success: true, profile })
})
