export type ViewMode = 'grid' | 'list'
/** @deprecated Prefer ViewMode — alias kept for existing call sites */
export type ProductsViewMode = ViewMode

export interface UserProfile {
	id: string
	email: string | null
	firstName: string | null
	lastName: string | null
	avatarUrl: string | null
	roles: string[]
	phoneNumber: string | null
	emailVerified: boolean | null
	phoneVerified: boolean | null
	sellerProfile: {
		id: string
		status: string
	} | null
	stores: Array<{
		id: string
		name: string
		slug: string
		status: string | null
		productCount: number
	}>
	onboarding: {
		status: string
		currentStep: string | null
	} | null
}
