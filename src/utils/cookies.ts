'use server'

import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'

export async function createSession(idToken: string) {
	console.log('[auth/cookies] creating session cookie')

	const cookieStore = await cookies()
	const expiresIn = 60 * 60 * 24 * 7 * 1000 // 7 dias

	try {
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn,
		})

		const maxAge = expiresIn / 1000

		cookieStore.set(SESSION_COOKIE, sessionCookie, {
			maxAge,
			httpOnly: process.env.NODE_ENV === 'production',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
		})

		console.log('[auth/cookies] session cookie set', {
			maxAge,
			httpOnly: process.env.NODE_ENV === 'production',
		})

		return { success: true }
	} catch (error) {
		console.error('[auth/cookies] createSessionCookie failed', error)
		throw error
	}
}

export async function deleteSession() {
	const cookieStore = await cookies()
	cookieStore.delete(SESSION_COOKIE)
	return { success: true }
}
