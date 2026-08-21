import type { UserProfile } from './marketplace'

export type GetProfileOutput = {
	success: true
	profile: UserProfile
}
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
