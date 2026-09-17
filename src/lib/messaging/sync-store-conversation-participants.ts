import type { createSupabaseAdmin } from '@/lib/supabase/admin'

type Db = ReturnType<typeof createSupabaseAdmin>

export async function resolveStoreConversationBuyerId(
	db: Db,
	conversationId: string,
	storeOwnerId: string,
	previousOwnerId?: string
): Promise<string | null> {
	const { data: order } = await db
		.from('orders')
		.select('buyer_id')
		.eq('conversation_id', conversationId)
		.is('deleted_at', null)
		.limit(1)
		.maybeSingle()
	if (order?.buyer_id) return order.buyer_id as string

	const { data: buyerMsg } = await db
		.from('messages')
		.select('user_id')
		.eq('conversation_id', conversationId)
		.is('store_id', null)
		.is('deleted_at', null)
		.order('created_at', { ascending: true })
		.limit(1)
		.maybeSingle()
	if (buyerMsg?.user_id) return buyerMsg.user_id as string

	const { data: parts } = await db
		.from('conversation_participants')
		.select('user_id')
		.eq('conversation_id', conversationId)
	const nonOwners = (parts ?? []).filter((p) => p.user_id !== storeOwnerId)
	if (nonOwners.length === 1) return nonOwners[0].user_id as string
	if (previousOwnerId) {
		const candidates = nonOwners.filter(
			(p) => p.user_id !== previousOwnerId
		)
		if (candidates.length === 1) return candidates[0].user_id as string
	}
	return null
}

export async function syncStoreConversationParticipants(
	db: Db,
	conversationId: string,
	storeOwnerId: string,
	buyerId: string
): Promise<void> {
	const { data: parts } = await db
		.from('conversation_participants')
		.select('user_id')
		.eq('conversation_id', conversationId)

	for (const part of parts ?? []) {
		const userId = part.user_id as string
		if (userId !== buyerId && userId !== storeOwnerId) {
			await db
				.from('conversation_participants')
				.delete()
				.eq('conversation_id', conversationId)
				.eq('user_id', userId)
		}
	}

	const { data: ownerPart } = await db
		.from('conversation_participants')
		.select('user_id')
		.eq('conversation_id', conversationId)
		.eq('user_id', storeOwnerId)
		.maybeSingle()
	if (!ownerPart) {
		await db.from('conversation_participants').insert({
			conversation_id: conversationId,
			user_id: storeOwnerId,
		})
	}
}

export async function syncStoreConversationParticipantsForStore(
	db: Db,
	storeId: string,
	storeOwnerId: string,
	previousOwnerId?: string
): Promise<void> {
	const { data: conversations } = await db
		.from('conversations')
		.select('id')
		.eq('store_id', storeId)
		.is('deleted_at', null)

	for (const conv of conversations ?? []) {
		const conversationId = conv.id as string
		const buyerId = await resolveStoreConversationBuyerId(
			db,
			conversationId,
			storeOwnerId,
			previousOwnerId
		)
		if (buyerId) {
			await syncStoreConversationParticipants(
				db,
				conversationId,
				storeOwnerId,
				buyerId
			)
		}
	}
}
