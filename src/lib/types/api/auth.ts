// ─── Auth routes ───────────────────────────────────────

/** POST /api/auth/register */
export type RegisterInput = { token: string }

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

/** POST /api/auth/session */
export type CreateSessionInput = { token: string }

export type CreateSessionOutput = {
	status: 'login success.'
}

/** POST /api/auth/logout */
export type LogoutOutput = {
	success: true
}

/** POST /api/auth/delete-account */
export type DeleteAccountOutput = {
	success: true
}
