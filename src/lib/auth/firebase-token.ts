import { cookies, headers } from 'next/headers'
import { adminAuth } from '@/lib/firebase/firebase-admin'
import { SESSION_COOKIE } from '@/utils/constants'

export async function getBearerIdTokenFromHeaders(): Promise<string | null> {
	const authHeader = (await headers()).get('authorization')
	if (!authHeader?.startsWith('Bearer ')) return null
	return authHeader.slice('Bearer '.length)
}

export async function getFirebaseUidFromRequest(): Promise<string | null> {
	const session = (await cookies()).get(SESSION_COOKIE)?.value
	if (session) {
		const decoded = await adminAuth.verifySessionCookie(session, true)
		return decoded.uid
	}

	const idToken = await getBearerIdTokenFromHeaders()
	if (idToken) {
		const decoded = await adminAuth.verifyIdToken(idToken, true)
		return decoded.uid
	}

	return null
}

export async function resolveFirebaseIdToken(
	request: Request
): Promise<string | null> {
	const bearerToken = await getBearerIdTokenFromHeaders()
	if (bearerToken) return bearerToken

	try {
		const body = await request.json()
		if (typeof body?.token === 'string' && body.token.length > 0) {
			return body.token
		}
	} catch {
		// Body may be empty when mobile sends only Authorization header.
	}

	return null
}
