import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type AdminClient = ReturnType<typeof createSupabaseAdmin>

async function countUnreadConversations(
	supabase: AdminClient,
	storeId: string,
	ownerId: string
): Promise<number> {
	const { data, error } = await supabase.rpc(
		'count_store_unread_conversations',
		{
			p_store_id: storeId,
			p_owner_id: ownerId,
		}
	)
	if (!error && typeof data === 'number') return data
	if (error) {
		console.error('[count_store_unread_conversations]', error.message)
	}
	return countUnreadConversationsFallback(supabase, storeId, ownerId)
}

async function countUnreadConversationsFallback(
	supabase: AdminClient,
	storeId: string,
	ownerId: string
): Promise<number> {
	const { data: conversations, error: convError } = await supabase
		.from('conversations')
		.select('id, last_message_id')
		.eq('store_id', storeId)
		.is('deleted_at', null)
	if (convError) throw convError
	const convIds = (conversations ?? []).map((row) => row.id)
	if (convIds.length === 0) return 0
	const lastMessageIds = (conversations ?? [])
		.map((row) => row.last_message_id)
		.filter((id): id is string => Boolean(id))
	const [participantsResult, messagesResult] = await Promise.all([
		supabase
			.from('conversation_participants')
			.select('conversation_id, last_read_at')
			.eq('user_id', ownerId)
			.in('conversation_id', convIds),
		lastMessageIds.length > 0
			? supabase
					.from('messages')
					.select('id, conversation_id, created_at, store_id')
					.in('id', lastMessageIds)
					.is('deleted_at', null)
			: Promise.resolve({
					data: [] as Array<{
						id: string
						conversation_id: string
						created_at: string | null
						store_id: string | null
					}>,
					error: null,
				}),
	])
	if (participantsResult.error) throw participantsResult.error
	if (messagesResult.error) throw messagesResult.error
	const lastReadByConversation = new Map(
		(participantsResult.data ?? []).map((row) => [
			row.conversation_id,
			row.last_read_at,
		])
	)
	const lastMessageByConversation = new Map(
		(messagesResult.data ?? []).map((row) => [row.conversation_id, row])
	)
	let unread = 0
	for (const conversationId of convIds) {
		const lastMessage = lastMessageByConversation.get(conversationId)
		if (!lastMessage || lastMessage.store_id != null) continue
		const lastRead = lastReadByConversation.get(conversationId)
		const createdAt = lastMessage.created_at
		if (createdAt && (!lastRead || createdAt > lastRead)) {
			unread += 1
		}
	}
	return unread
}

export async function GET() {
	try {
		const auth = await requireSellerStore({ permission: 'store.read' })
		if (isSellerStoreAuthError(auth)) {
			return NextResponse.json(
				{ pendingOrders: 0, unreadMessages: 0 },
				{ status: 200 }
			)
		}
		const { store } = auth
		const supabase = createSupabaseAdmin()
		const storeId = store.id as string
		const ownerId = store.owner_id as string
		const [{ count: pendingCount, error: pendingError }, unreadMessages] =
			await Promise.all([
				supabase
					.from('orders')
					.select('*', { count: 'exact', head: true })
					.eq('store_id', storeId)
					.in('status', ['PENDING', 'CONTACTED'])
					.is('deleted_at', null),
				countUnreadConversations(supabase, storeId, ownerId),
			])
		if (pendingError) throw pendingError
		return NextResponse.json({
			pendingOrders: pendingCount ?? 0,
			unreadMessages,
		})
	} catch (error) {
		console.error('[GET /api/seller/unread-counts]', error)
		return NextResponse.json(
			{ pendingOrders: 0, unreadMessages: 0 },
			{ status: 200 }
		)
	}
}
