import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Params {
	params: Promise<{
		id: string
	}>
}
export async function PATCH(_request: Request, { params }: Params) {
	try {
		const { id: conversationId } = await params
		const auth = await requireSellerStore({ permission: 'message.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
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
		const { error } = await supabase
			.from('conversation_participants')
			.update({ last_read_at: new Date().toISOString() })
			.eq('conversation_id', conversationId)
			.eq('user_id', store.owner_id)
		if (error) throw error
		return NextResponse.json({ success: true })
	} catch (err) {
		console.error('[PATCH /api/stores/conversations/:id/read]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
