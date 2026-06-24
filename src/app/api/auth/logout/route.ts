import { NextResponse } from 'next/server'
import { deleteSession } from '@/utils/cookies'

export async function POST() {
	await deleteSession()
	return NextResponse.json({ success: true })
}
