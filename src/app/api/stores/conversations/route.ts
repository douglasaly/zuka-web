import type { NextRequest } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { apiCursorList, withErrorHandling } from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { CursorPaginationSchema } from '@/lib/validations'
export const GET = withErrorHandling(async (request: NextRequest) => {
	const auth = await requireSellerStore({ permission: 'message.read' })
	if (isSellerStoreAuthError(auth)) return auth.error
	const { store } = auth
	const { searchParams } = new URL(request.url)
	const { limit, cursor } = CursorPaginationSchema.parse({
		limit: searchParams.get('limit') ?? undefined,
		cursor: searchParams.get('cursor') ?? undefined,
	})
	const supabase = createSupabaseAdmin()
	let query = supabase
		.from('conversations')
		.select('id, last_message_at, last_message_id')
		.eq('store_id', store.id)
		.is('deleted_at', null)
		.order('last_message_at', { ascending: false, nullsFirst: false })
		.limit(limit + 1)
	if (cursor) {
		query = query.lt('last_message_at', cursor)
	}
	const { data: conversations, error } = await query
	if (error) throw error
	if (!conversations || conversations.length === 0) {
		return apiCursorList([], { hasMore: false, nextCursor: null, limit })
	}
	const hasMore = conversations.length > limit
	const pageItems = hasMore ? conversations.slice(0, limit) : conversations
	const conversationIds = pageItems.map((c) => c.id)
	const { data: participants } = await supabase
		.from('conversation_participants')
		.select('conversation_id, user_id, last_read_at')
		.in('conversation_id', conversationIds)
	const buyerIds: string[] = []
	const storeOwnerLastRead = new Map<string, string | null>()
	for (const conv of pageItems) {
		const allParts = (participants ?? []).filter(
			(p) => p.conversation_id === conv.id
		)
		const ownerPart = allParts.find((p) => p.user_id === store.owner_id)
		const buyerPart = allParts.find((p) => p.user_id !== store.owner_id)
		if (ownerPart) storeOwnerLastRead.set(conv.id, ownerPart.last_read_at)
		if (buyerPart) buyerIds.push(buyerPart.user_id)
	}
	const { data: buyers } =
		buyerIds.length > 0
			? await supabase
					.from('users')
					.select('id, first_name, last_name, avatar_url')
					.in('id', buyerIds)
			: {
					data: [] as Array<{
						id: string
						first_name: string | null
						last_name: string | null
						avatar_url: string | null
					}>,
				}
	const buyerMap = new Map((buyers ?? []).map((b) => [b.id, b]))
	const lastMessageIds = pageItems
		.map((c) => c.last_message_id)
		.filter(Boolean) as string[]
	const lastMessageById = new Map<
		string,
		{ content: string; store_id: string | null; created_at: string | null }
	>()
	if (lastMessageIds.length > 0) {
		const { data: lastMessages } = await supabase
			.from('messages')
			.select('id, content, store_id, created_at')
			.in('id', lastMessageIds)
			.is('deleted_at', null)
		for (const m of lastMessages ?? []) {
			lastMessageById.set(m.id, {
				content: m.content,
				store_id: m.store_id,
				created_at: m.created_at,
			})
		}
	}
	const data = pageItems.map((conv) => {
		const members = (participants ?? []).filter(
			(p) => p.conversation_id === conv.id
		)
		const buyerPart = members.find((p) => p.user_id !== store.owner_id)
		const buyerUser = buyerPart ? buyerMap.get(buyerPart.user_id) : null
		const firstName = buyerUser?.first_name ?? ''
		const lastName = buyerUser?.last_name ?? ''
		const name =
			[firstName, lastName].filter(Boolean).join(' ') || 'Cliente'
		const lastMessage = conv.last_message_id
			? lastMessageById.get(conv.last_message_id)
			: undefined
		const lastRead = storeOwnerLastRead.get(conv.id)
		const unread = Boolean(
			lastMessage &&
				lastMessage.store_id == null &&
				lastMessage.created_at &&
				(!lastRead || lastMessage.created_at > lastRead)
		)
		return {
			id: conv.id,
			otherUserName: name,
			otherUserAvatar: buyerUser?.avatar_url ?? null,
			lastMessage: lastMessage?.content ?? null,
			lastMessageAt: conv.last_message_at,
			unread,
		}
	})
	const nextCursor = hasMore
		? (pageItems[pageItems.length - 1]?.last_message_at ?? null)
		: null
	return apiCursorList(data, { hasMore, nextCursor, limit })
})
