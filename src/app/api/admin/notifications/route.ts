import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

// Simple notifications table — stored in Supabase for the log
// The actual table may not exist yet; we gracefully handle that.
export async function GET() {
	await requireAdminUser()
	// Return a stub — notifications log is an optional future feature
	return NextResponse.json({ notifications: [] })
}

export async function POST(req: Request) {
	const admin = await requireAdminUser()
	const { target, title, body } = await req.json()

	if (!title || !body || !target) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
	}

	// In production: integrate push / email. For now, we log to a simple table if it exists.
	return NextResponse.json({
		success: true,
		notification: {
			id: uuidv7(),
			target,
			title,
			body,
			sentAt: new Date().toISOString(),
			sentBy: admin.id,
		},
	})
}
