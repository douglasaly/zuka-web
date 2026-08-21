export type RegisterInput = {
	token: string
}
export type RegisterOutput = {
	success: true
	user: {
		id: string
		firebaseUid: string
		email: string | null
		firstName: string | null
		lastName: string | null
	}
}
export type CreateSessionInput = {
	token: string
}
export type CreateSessionOutput = {
	status: 'login success.'
}
export type LogoutOutput = {
	success: true
}
export type DeleteAccountOutput = {
	success: true
}
