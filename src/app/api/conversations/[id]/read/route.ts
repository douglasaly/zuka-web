import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Params {
	params: Promise<{ id: string }>
}

export async function PATCH(_req: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { error } = await supabase
			.from('conversation_participants')
			.update({ last_read_at: new Date().toISOString() })
			.eq('conversation_id', conversationId)
			.eq('user_id', user.id)

		if (error) throw error

		return NextResponse.json({ success: true })
	} catch (err) {
		console.error('[PATCH /api/conversations/:id/read]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
