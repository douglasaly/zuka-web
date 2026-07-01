import { NextResponse } from 'next/server'
import { createSession } from '@/utils/cookies'

export async function POST(request: Request) {
	const { token } = await request.json()
	console.log('[auth/session] POST received', { hasToken: Boolean(token) })

	try {
		await createSession(token)
		console.log('[auth/session] session cookie created')
		return NextResponse.json({ status: 'login success.' })
	} catch (error) {
		console.error('[auth/session] failed', error)
		return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
	}
}
