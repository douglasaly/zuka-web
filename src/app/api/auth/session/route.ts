import { NextResponse } from 'next/server'
import { createSession } from '@/utils/cookies'

export async function POST(request: Request) {
	const { token } = await request.json()

	try {
		await createSession(token)
		return NextResponse.json({ status: 'login success.' })
	} catch (error) {
		return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
	}
}
