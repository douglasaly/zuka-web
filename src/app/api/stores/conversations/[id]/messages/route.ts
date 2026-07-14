import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Params {
	params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params

		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error
		const { store } = auth

		const supabase = createSupabaseAdmin()

		const { data: conversation } = await supabase
			.from('conversations')
			.select('id')
			.eq('id', conversationId)
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.single()

		if (!conversation) {
			return NextResponse.json(
				{ error: 'Conversa não encontrada' },
				{ status: 404 }
			)
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
		console.error('[GET /api/stores/conversations/:id/messages]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params

		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error
		const { store } = auth

		const supabase = createSupabaseAdmin()

		const { data: conversation } = await supabase
			.from('conversations')
			.select('id')
			.eq('id', conversationId)
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.single()

		if (!conversation) {
			return NextResponse.json(
				{ error: 'Conversa não encontrada' },
				{ status: 404 }
			)
		}

		const { content } = await request.json()

		if (!content?.trim()) {
			return NextResponse.json(
				{ error: 'Conteúdo é obrigatório' },
				{ status: 400 }
			)
		}

		const messageId = uuidv7()

		const { data: message, error: msgError } = await supabase
			.from('messages')
			.insert({
				id: messageId,
				conversation_id: conversationId,
				user_id: null,
				store_id: store.id,
				content: content.trim(),
			})
			.select(
				'id, conversation_id, user_id, store_id, content, status, created_at'
			)
			.single()

		if (msgError) throw msgError

		const { error: updateError } = await supabase
			.from('conversations')
			.update({
				last_message_at: new Date().toISOString(),
				last_message_id: messageId,
			})
			.eq('id', conversationId)

		if (updateError) throw updateError

		return NextResponse.json({ data: message }, { status: 201 })
	} catch (err) {
		console.error('[POST /api/stores/conversations/:id/messages]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
