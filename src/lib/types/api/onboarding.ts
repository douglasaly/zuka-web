// ─── Onboarding routes ─────────────────────────────────

/** POST /api/onboarding/role */
export type SetOnboardingRoleInput = {
	role: 'buyer' | 'seller'
}

export type SetOnboardingRoleOutput = {
	success: true
	role: string
}

/** POST /api/onboarding/verification */
export type SubmitVerificationInput = {
	idCardUrl: string
	selfieUrl: string
}

export type SubmitVerificationOutput = {
	success: true
}
