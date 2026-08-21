export type SetOnboardingRoleInput = {
	role: 'buyer' | 'seller'
}
export type SetOnboardingRoleOutput = {
	success: true
	role: string
}
export type SubmitVerificationInput = {
	idCardUrl: string
	selfieUrl: string
}
export type SubmitVerificationOutput = {
	success: true
}
