import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getManagedStoreIds } from '@/lib/auth/seller'
import {
	apiError,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type AdminClient = ReturnType<typeof createSupabaseAdmin>

async function countBuyerUnreadConversationsFallback(
	supabase: AdminClient,
	userId: string,
	excludeStoreIds: string[]
): Promise<number> {
	let query = supabase
		.from('conversations')
		.select(
			`
			id,
			store_id,
			conversation_participants!inner ( user_id, last_read_at )
		`
		)
		.eq('conversation_participants.user_id', userId)
		.is('deleted_at', null)
	if (excludeStoreIds.length > 0) {
		query = query.not('store_id', 'in', `(${excludeStoreIds.join(',')})`)
	}
	const { data: conversations, error: convError } = await query
	if (convError) throw convError
	const convIds = (conversations ?? []).map((row) => row.id as string)
	if (convIds.length === 0) return 0

	const lastReadByConversation = new Map<string, string | null>()
	for (const row of conversations ?? []) {
		const participant = Array.isArray(row.conversation_participants)
			? row.conversation_participants[0]
			: row.conversation_participants
		lastReadByConversation.set(
			row.id as string,
			(participant?.last_read_at as string | null) ?? null
		)
	}

	const { data: storeMessages, error: msgError } = await supabase
		.from('messages')
		.select('conversation_id, created_at')
		.in('conversation_id', convIds)
		.not('store_id', 'is', null)
		.is('deleted_at', null)
	if (msgError) throw msgError

	let unreadConversations = 0
	for (const conversationId of convIds) {
		const lastRead = lastReadByConversation.get(conversationId)
		const hasUnread = (storeMessages ?? []).some(
			(msg) =>
				msg.conversation_id === conversationId &&
				msg.created_at &&
				(!lastRead || msg.created_at > lastRead)
		)
		if (hasUnread) unreadConversations += 1
	}
	return unreadConversations
}

export const GET = withErrorHandling(async () => {
	const auth = await requireAuth()
	const supabase = createSupabaseAdmin()
	const userId = auth.user.id as string
	const excludeStoreIds = await getManagedStoreIds(userId)

	const { data, error } = await supabase.rpc(
		'count_buyer_unread_conversations',
		{
			p_user_id: userId,
			p_exclude_store_ids: excludeStoreIds,
		}
	)
	if (!error && typeof data === 'number') {
		return NextResponse.json({
			success: true,
			unreadMessages: data,
		})
	}
	if (error) {
		console.error('[count_buyer_unread_conversations]', error.message)
	}

	try {
		const unreadMessages = await countBuyerUnreadConversationsFallback(
			supabase,
			userId,
			excludeStoreIds
		)
		return NextResponse.json({ success: true, unreadMessages })
	} catch (fallbackError) {
		console.error('[GET /api/conversations/unread-count]', fallbackError)
		return apiError(
			ErrorCode.INTERNAL_ERROR,
			'Não foi possível carregar mensagens não lidas',
			500
		)
	}
})
