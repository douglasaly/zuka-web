import type { UserProfile } from '@/types/marketplace'

export function hasActiveStore(profile: UserProfile | null | undefined) {
	return Boolean(profile?.stores?.some((store) => store.status === 'ACTIVE'))
}

export function needsSellerOnboarding(profile: UserProfile | null | undefined) {
	if (!profile?.roles.includes('seller')) return false
	return (
		!profile.stores.length ||
		profile.onboarding?.status === 'DRAFT' ||
		profile.onboarding?.status === 'SUBMITTED'
	)
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

		// Loja pendente / inactiva / suspensa — interface de comprador
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
