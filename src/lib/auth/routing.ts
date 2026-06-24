import type { UserProfile } from '@/types/marketplace'

export function getPostLoginPath(
	profile: UserProfile | null,
	next?: string | null
) {
	if (next?.startsWith('/') && !next.startsWith('//')) {
		return next
	}

	if (profile?.roles.includes('seller')) {
		const needsOnboarding =
			!profile.stores.length ||
			profile.onboarding?.status === 'DRAFT' ||
			profile.onboarding?.status === 'SUBMITTED'

		if (needsOnboarding) {
			return '/onboarding/seller'
		}

		return '/dashboard/seller'
	}

	return '/feed/explorar'
}

export function isSeller(profile: UserProfile | null) {
	return Boolean(profile?.roles.includes('seller'))
}

export function isBuyer(profile: UserProfile | null) {
	return Boolean(profile?.roles.includes('buyer'))
}
