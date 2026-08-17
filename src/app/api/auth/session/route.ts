import { NextResponse } from 'next/server'
import { resolveFirebaseIdToken } from '@/lib/auth/firebase-token'
import { createSession } from '@/lib/auth/session-cookie'
export const runtime = 'nodejs'
export async function POST(request: Request) {
	const token = await resolveFirebaseIdToken(request)
	console.log('[auth/session] POST received', { hasToken: Boolean(token) })
	if (!token) {
		return NextResponse.json({ error: 'Missing token' }, { status: 401 })
	}
	try {
		await createSession(token)
		console.log('[auth/session] session cookie created')
		return NextResponse.json({ status: 'login success.' })
	} catch (error) {
		console.error('[auth/session] failed', error)
		return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
	}
}
