// ─── Profile routes ────────────────────────────────────

/** GET /api/me/profile */
export type GetProfileOutput = {
	success: true
	profile: {
		id: string
		email: string | null
		firstName: string | null
		lastName: string | null
		avatarUrl: string | null
		phoneNumber: string | null
		emailVerified: boolean | null
		phoneVerified: boolean | null
		roles: string[]
		sellerProfile: {
			id: string
			status: string
		} | null
		stores: {
			id: string
			name: string
			slug: string
			status: string | null
			productCount: number
		}[]
		onboarding: {
			status: string
			currentStep: string | null
		} | null
	}
}

/** PATCH /api/me/profile */
export type UpdateProfileInput = {
	firstName?: string
	lastName?: string
	phoneNumber?: string
	avatarUrl?: string
}

export type UpdateProfileOutput = {
	success: true
	profile: {
		id: string
		email: string | null
		firstName: string | null
		lastName: string | null
		avatarUrl: string | null
		phoneNumber: string | null
	}
}
