import { uuidv7 } from 'uuidv7'
import { requireAuth } from '@/lib/auth'
import { getManagedStoreIds } from '@/lib/auth/seller'
import {
	apiCursorList,
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	CreateConversationSchema,
	CursorPaginationSchema,
} from '@/lib/validations'

type AdminClient = ReturnType<typeof createSupabaseAdmin>

async function countBuyerUnreadByConversations(
	supabase: AdminClient,
	userId: string,
	conversationIds: string[]
): Promise<Map<string, number>> {
	if (conversationIds.length === 0) return new Map()
	const { data, error } = await supabase.rpc(
		'count_buyer_unread_by_conversations',
		{
			p_user_id: userId,
			p_conversation_ids: conversationIds,
		}
	)
	if (!error && Array.isArray(data)) {
		return new Map(
			(
				data as Array<{
					conversation_id: string
					unread_count: number
				}>
			).map((row) => [row.conversation_id, row.unread_count])
		)
	}
	if (error) {
		console.error('[count_buyer_unread_by_conversations]', error.message)
	}
	return countBuyerUnreadByConversationsFallback(
		supabase,
		userId,
		conversationIds
	)
}

async function countBuyerUnreadByConversationsFallback(
	supabase: AdminClient,
	userId: string,
	conversationIds: string[]
): Promise<Map<string, number>> {
	const { data: participants, error: participantsError } = await supabase
		.from('conversation_participants')
		.select('conversation_id, last_read_at')
		.eq('user_id', userId)
		.in('conversation_id', conversationIds)
	if (participantsError) throw participantsError
	const lastReadAtMap = new Map(
		(participants ?? []).map((row) => [
			row.conversation_id,
			row.last_read_at,
		])
	)
	const unreadMap = new Map<string, number>()
	await Promise.all(
		conversationIds.map(async (conversationId) => {
			const lastReadAt = lastReadAtMap.get(conversationId)
			let query = supabase
				.from('messages')
				.select('id', { count: 'exact', head: true })
				.eq('conversation_id', conversationId)
				.not('store_id', 'is', null)
				.is('deleted_at', null)
			if (lastReadAt) {
				query = query.gt('created_at', lastReadAt)
			}
			const { count, error } = await query
			if (error) throw error
			if ((count ?? 0) > 0) {
				unreadMap.set(conversationId, count ?? 0)
			}
		})
	)
	return unreadMap
}

export const GET = withErrorHandling(async (request) => {
	const auth = await requireAuth()
	const { searchParams } = new URL(request.url)
	const { limit, cursor } = CursorPaginationSchema.parse({
		limit: searchParams.get('limit') ?? undefined,
		cursor: searchParams.get('cursor') ?? undefined,
	})
	const supabase = createSupabaseAdmin()
	const managedStoreIds = await getManagedStoreIds(auth.user.id)
	let query = supabase
		.from('conversations')
		.select(`
			id,
			last_message_at,
			last_message_id,
			product_id,
			stores ( id, name, logo_url, slug ),
			conversation_participants!inner ( user_id, last_read_at )
		`)
		.eq('conversation_participants.user_id', auth.user.id)
		.is('deleted_at', null)
		.order('last_message_at', { ascending: false })
		.limit(limit + 1)
	if (managedStoreIds.length > 0) {
		query = query.not('store_id', 'in', `(${managedStoreIds.join(',')})`)
	}
	if (cursor) {
		query = query.lt('last_message_at', cursor)
	}
	const { data: conversations, error } = await query
	if (error) throw error
	const hasMore = (conversations?.length ?? 0) > limit
	const pageItems = hasMore
		? (conversations?.slice(0, limit) ?? [])
		: (conversations ?? [])
	const lastMessageIds = pageItems
		.map((c) => c.last_message_id)
		.filter(Boolean) as string[]
	const conversationIds = pageItems.map((c) => c.id)
	const [lastMessagesResult, unreadMap] = await Promise.all([
		lastMessageIds.length > 0
			? supabase
					.from('messages')
					.select('id, content, user_id, store_id')
					.in('id', lastMessageIds)
			: Promise.resolve({ data: [] }),
		countBuyerUnreadByConversations(
			supabase,
			auth.user.id,
			conversationIds
		),
	])
	const lastMessageMap = new Map(
		(lastMessagesResult.data ?? []).map((m) => [
			m.id,
			{ content: m.content, userId: m.user_id, storeId: m.store_id },
		])
	)
	const inbox = pageItems.map((c) => {
		const lastMsg = c.last_message_id
			? (lastMessageMap.get(c.last_message_id) ?? null)
			: null
		return {
			conversationId: c.id,
			productId: c.product_id ?? null,
			lastMessageAt: c.last_message_at,
			lastMessage: lastMsg?.content ?? null,
			isLastMessageMine: lastMsg?.userId === auth.user.id,
			unreadCount: unreadMap.get(c.id) ?? 0,
			store: {
				id: c.stores?.id ?? null,
				name: c.stores?.name ?? 'Loja',
				logoUrl: c.stores?.logo_url ?? null,
				slug: c.stores?.slug ?? null,
			},
		}
	})
	const nextCursor = hasMore
		? (pageItems[pageItems.length - 1]?.last_message_at ?? null)
		: null
	return apiCursorList(inbox, { hasMore, nextCursor, limit })
})
export const POST = withErrorHandling(async (request) => {
	const auth = await requireAuth()
	const body = await request.json()
	const parsed = CreateConversationSchema.safeParse(body)
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0].message
		)
	}
	const { productId, content } = parsed.data
	const supabase = createSupabaseAdmin()
	const { data: product } = await supabase
		.from('products')
		.select('store_id, stores!inner(owner_id)')
		.eq('id', productId)
		.is('deleted_at', null)
		.single()
	if (!product) {
		return apiError(ErrorCode.NOT_FOUND, 'Produto não encontrado')
	}
	const storeOwnerId = (
		product.stores as {
			owner_id: string
		}
	).owner_id
	const storeId = product.store_id as string
	const managedStoreIds = await getManagedStoreIds(auth.user.id)
	if (managedStoreIds.includes(storeId)) {
		return apiError(
			ErrorCode.FORBIDDEN,
			'Não pode iniciar conversa com a sua própria loja neste ecrã. Use o dashboard.'
		)
	}
	const { data: existingRows, error: existingError } = await supabase
		.from('conversations')
		.select(`
			id,
			deleted_at,
			conversation_participants!inner ( user_id )
		`)
		.eq('store_id', storeId)
		.eq('conversation_participants.user_id', auth.user.id)
		.order('deleted_at', { ascending: true, nullsFirst: true })
		.order('last_message_at', { ascending: false, nullsFirst: false })
		.order('created_at', { ascending: false })
		.limit(1)
	if (existingError) throw existingError
	const existing = existingRows?.[0] ?? null
	let conversationId: string
	let created = false
	if (existing) {
		conversationId = existing.id as string
		const updates: {
			product_id: string
			deleted_at?: null
			updated_at: string
		} = {
			product_id: productId,
			updated_at: new Date().toISOString(),
		}
		if (existing.deleted_at) {
			updates.deleted_at = null
		}
		const { error: reviveError } = await supabase
			.from('conversations')
			.update(updates)
			.eq('id', conversationId)
		if (reviveError) throw reviveError
		const { data: ownerPart } = await supabase
			.from('conversation_participants')
			.select('user_id')
			.eq('conversation_id', conversationId)
			.eq('user_id', storeOwnerId)
			.maybeSingle()
		if (!ownerPart) {
			const { error: ownerPartError } = await supabase
				.from('conversation_participants')
				.insert({
					conversation_id: conversationId,
					user_id: storeOwnerId,
				})
			if (ownerPartError) throw ownerPartError
		}
	} else {
		conversationId = uuidv7()
		created = true
		const { error: convError } = await supabase
			.from('conversations')
			.insert({
				id: conversationId,
				product_id: productId,
				store_id: storeId,
			})
		if (convError) throw convError
		const { error: partError } = await supabase
			.from('conversation_participants')
			.insert([
				{ conversation_id: conversationId, user_id: auth.user.id },
				{ conversation_id: conversationId, user_id: storeOwnerId },
			])
		if (partError) throw partError
	}
	if (content?.trim()) {
		const messageId = uuidv7()
		const { error: msgError } = await supabase.from('messages').insert({
			id: messageId,
			conversation_id: conversationId,
			user_id: auth.user.id,
			store_id: null,
			content: content.trim(),
		})
		if (msgError) throw msgError
		await supabase
			.from('conversations')
			.update({
				last_message_at: new Date().toISOString(),
				last_message_id: messageId,
			})
			.eq('id', conversationId)
	}
	return apiSuccess({ conversationId }, created ? 201 : 200)
})
