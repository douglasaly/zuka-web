import { uuidv7 } from 'uuidv7'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export const ADMIN_ROLE_NAMES = ['admin', 'super_admin'] as const

export function hasAdminAccess(roles: string[]) {
	return roles.some((role) =>
		ADMIN_ROLE_NAMES.includes(role as (typeof ADMIN_ROLE_NAMES)[number])
	)
}

export async function getRoleIdByName(name: string) {
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('roles')
		.select('id')
		.eq('name', name)
		.maybeSingle()

	if (error) throw error
	return data?.id as string | undefined
}

export async function assignUserRole(userId: string, roleName: string) {
	const supabase = createSupabaseAdmin()
	const roleId = await getRoleIdByName(roleName)
	if (!roleId) throw new Error(`Role ${roleName} not found`)

	const { error } = await supabase
		.from('user_roles')
		.upsert(
			{ user_id: userId, role_id: roleId },
			{ onConflict: 'user_id,role_id', ignoreDuplicates: true }
		)

	if (error) throw error
}

export async function getUserRoles(userId: string) {
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('user_roles')
		.select('roles(name)')
		.eq('user_id', userId)

	if (error) throw error

	return ((data ?? []) as Array<Record<string, unknown>>)
		.map((row) => {
			const roles = row.roles as
				| { name: string }
				| { name: string }[]
				| null
			if (Array.isArray(roles)) return roles[0]?.name
			return roles?.name
		})
		.filter(Boolean) as string[]
}

export async function ensureSellerProfile(userId: string) {
	const supabase = createSupabaseAdmin()

	const { data: existing, error: selectError } = await supabase
		.from('seller_profiles')
		.select('*')
		.eq('user_id', userId)
		.maybeSingle()

	if (selectError) throw selectError
	if (existing) return existing

	const profileId = uuidv7()
	const { data: profile, error: insertError } = await supabase
		.from('seller_profiles')
		.insert({
			id: profileId,
			user_id: userId,
			status: 'PENDING',
		})
		.select('*')
		.single()

	if (insertError) throw insertError

	const { error: onboardingError } = await supabase
		.from('seller_onboarding')
		.insert({
			id: uuidv7(),
			seller_profile_id: profileId,
			status: 'DRAFT',
			current_step: 'STORE_INFO',
		})

	if (onboardingError) throw onboardingError

	return profile
}
