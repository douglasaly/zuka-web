import type { UserProfile } from '@/types/marketplace'
export function hasActiveStore(profile: UserProfile | null | undefined) {
	return Boolean(profile?.stores?.some((store) => store.status === 'ACTIVE'))
}
export function needsSellerOnboarding(profile: UserProfile | null | undefined) {
	if (!profile?.roles.includes('seller')) return false
	if (!profile.sellerProfile) return false
	const status = profile.onboarding?.status
	if (status !== 'APPROVED') return true
	if (!profile.stores.length) return true
	return false
}
export function isAwaitingSellerApproval(
	profile: UserProfile | null | undefined
) {
	return profile?.onboarding?.status === 'SUBMITTED'
}
export function getSellerPanelPath(profile: UserProfile | null | undefined) {
	if (!profile?.roles.includes('seller') || needsSellerOnboarding(profile)) {
		return '/onboarding/seller'
	}
	return '/dashboard/seller'
}
export function getPostLoginPath(
	profile: UserProfile | null,
	next?: string | null
) {
	if (next?.startsWith('/') && !next.startsWith('//')) {
		return next
	}
	if (profile?.roles.includes('seller')) {
		if (needsSellerOnboarding(profile)) {
			return '/onboarding/seller'
		}
		if (hasActiveStore(profile)) {
			return '/dashboard/seller'
		}
		return '/feed/explorar'
	}
	return '/feed/explorar'
}
export function isSeller(profile: UserProfile | null) {
	return Boolean(profile?.roles.includes('seller'))
}
export function isBuyer(profile: UserProfile | null) {
	return Boolean(profile?.roles.includes('buyer'))
}
