import { redirect } from 'next/navigation'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export default async function DashboardPage() {
	const user = await getSessionUser()

	if (!user) {
		redirect('/auth/login?next=/dashboard')
	}

	const userId = user.id as string
	const roles = await getUserRoles(userId)

	if (!roles.includes('seller')) {
		redirect('/onboarding/seller')
	}

	const supabase = createSupabaseAdmin()

	const { data: sellerProfile } = await supabase
		.from('seller_profiles')
		.select('id')
		.eq('user_id', userId)
		.maybeSingle()

	if (!sellerProfile) {
		redirect('/onboarding/seller')
	}

	const [{ count: storeCount }, { data: onboarding }] = await Promise.all([
		supabase
			.from('stores')
			.select('*', { count: 'exact', head: true })
			.eq('seller_profile_id', sellerProfile.id)
			.is('deleted_at', null),
		supabase
			.from('seller_onboarding')
			.select('status')
			.eq('seller_profile_id', sellerProfile.id)
			.maybeSingle(),
	])

	// Dashboard only after admin approval
	if (onboarding?.status !== 'APPROVED' || !storeCount) {
		redirect('/onboarding/seller')
	}

	redirect('/dashboard/seller')
}
