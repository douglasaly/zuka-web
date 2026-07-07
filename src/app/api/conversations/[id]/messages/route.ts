import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Params {
	params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { data: participant } = await supabase
			.from('conversation_participants')
			.select('user_id')
			.eq('conversation_id', conversationId)
			.eq('user_id', user.id)
			.single()

		if (!participant) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { data, error } = await supabase
			.from('messages')
			.select(
				'id, conversation_id, user_id, store_id, content, status, created_at'
			)
			.eq('conversation_id', conversationId)
			.is('deleted_at', null)
			.order('created_at', { ascending: true })

		if (error) throw error

		return NextResponse.json({ data })
	} catch (err) {
		console.error('[GET /api/conversations/:id/messages]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function POST(req: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { data: participant } = await supabase
			.from('conversation_participants')
			.select('user_id')
			.eq('conversation_id', conversationId)
			.eq('user_id', user.id)
			.single()

		if (!participant) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { content } = await req.json()

		if (!content?.trim()) {
			return NextResponse.json(
				{ error: 'Content is required' },
				{ status: 400 }
			)
		}

		const { data, error } = await supabase
			.from('messages')
			.insert({
				id: crypto.randomUUID(),
				conversation_id: conversationId,
				user_id: user.id, // comprador envia → user_id preenchido
				store_id: null, // store_id sempre null quando é o comprador
				content: content.trim(),
			})
			.select()
			.single()

		if (error) throw error

		return NextResponse.json({ data }, { status: 201 })
	} catch (err) {
		console.error('[POST /api/conversations/:id/messages]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
