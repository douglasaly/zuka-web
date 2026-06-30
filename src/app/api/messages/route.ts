import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

const supabase = createSupabaseAdmin()
const LIMIT = 10

export async function GET(req: Request) {
	try {
		const user = await getSessionUser()

		const { searchParams } = new URL(req.url)
		const cursor = searchParams.get('cursor')

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		let query = supabase
			.from('messages')
			.select(`
				id,
				conversation_id,
				sender_id,
				content,
				created_at
			`)
			.eq('sender_id', user.id)
			.order('created_at', { ascending: false })
			.limit(LIMIT)

		// cursor pagination
		if (cursor) {
			query = query.lt('created_at', cursor)
		}

		const { data, error } = await query

		if (error) {
			return NextResponse.json(
				{ error: 'Failed to fetch messages' },
				{ status: 500 }
			)
		}

		// próximo cursor = última mensagem do batch
		const nextCursor =
			data && data.length === LIMIT
				? data[data.length - 1].created_at
				: null

		return NextResponse.json({
			data,
			nextCursor,
		})
	} catch (err) {
		console.error(err)

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
