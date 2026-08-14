import { uuidv7 } from 'uuidv7'
import type { createSupabaseAdmin } from '@/lib/supabase/admin'

type Db = ReturnType<typeof createSupabaseAdmin>

export async function ensureBuyerStoreConversation(input: {
	db: Db
	buyerId: string
	storeId: string
	storeOwnerId: string
	productId: string
}): Promise<string> {
	const { db, buyerId, storeId, storeOwnerId, productId } = input

	const { data: existingRows, error: existingError } = await db
		.from('conversations')
		.select(
			`
			id,
			deleted_at,
			conversation_participants!inner ( user_id )
		`
		)
		.eq('store_id', storeId)
		.eq('conversation_participants.user_id', buyerId)
		.order('deleted_at', { ascending: true, nullsFirst: true })
		.order('last_message_at', { ascending: false, nullsFirst: false })
		.order('created_at', { ascending: false })
		.limit(1)

	if (existingError) throw existingError

	const existing = existingRows?.[0]
	if (existing) {
		const conversationId = existing.id
		const updates: {
			product_id: string
			updated_at: string
			deleted_at?: null
		} = {
			product_id: productId,
			updated_at: new Date().toISOString(),
		}
		if (existing.deleted_at) updates.deleted_at = null

		const { error: reviveError } = await db
			.from('conversations')
			.update(updates)
			.eq('id', conversationId)
		if (reviveError) throw reviveError

		const { data: ownerPart } = await db
			.from('conversation_participants')
			.select('user_id')
			.eq('conversation_id', conversationId)
			.eq('user_id', storeOwnerId)
			.maybeSingle()

		if (!ownerPart) {
			const { error: ownerPartError } = await db
				.from('conversation_participants')
				.insert({
					conversation_id: conversationId,
					user_id: storeOwnerId,
				})
			if (ownerPartError) throw ownerPartError
		}

		return conversationId
	}

	const conversationId = uuidv7()
	const { error: convError } = await db.from('conversations').insert({
		id: conversationId,
		product_id: productId,
		store_id: storeId,
	})
	if (convError) throw convError

	const { error: partError } = await db
		.from('conversation_participants')
		.insert([
			{ conversation_id: conversationId, user_id: buyerId },
			{ conversation_id: conversationId, user_id: storeOwnerId },
		])
	if (partError) throw partError

	return conversationId
}

export async function postConversationMessage(input: {
	db: Db
	conversationId: string
	buyerId: string
	content: string
}) {
	const messageId = uuidv7()
	const now = new Date().toISOString()
	const { error } = await input.db.from('messages').insert({
		id: messageId,
		conversation_id: input.conversationId,
		user_id: input.buyerId,
		store_id: null,
		content: input.content,
	})
	if (error) throw error

	await input.db
		.from('conversations')
		.update({
			last_message_at: now,
			last_message_id: messageId,
			updated_at: now,
		})
		.eq('id', input.conversationId)
}
