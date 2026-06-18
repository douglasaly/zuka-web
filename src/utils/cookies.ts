'use server'

import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'

export async function createSession(idToken: string) {
	const cookieStore = await cookies()
	const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 dias

	try {
		// Cria o cookie de sessão oficial do Firebase
		const sessionCookie = await adminAuth.createSessionCookie(idToken, {
			expiresIn,
		})

		cookieStore.set(SESSION_COOKIE, sessionCookie, {
			maxAge: expiresIn / 1000,
			httpOnly: true, // Impede acesso via JavaScript no cliente
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			path: '/',
		})
		return { success: true }
	} catch (error) {
		return { success: false, error: 'Falha ao criar sessão' }
	}
}

export async function deleteSession() {
	const cookieStore = await cookies()
	cookieStore.delete('session')
	return { success: true }
}
