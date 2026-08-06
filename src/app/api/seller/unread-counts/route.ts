import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

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

		const { count: pendingCount, error: pendingError } = await supabase
			.from('orders')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', storeId)
			.in('status', ['PENDING', 'CONTACTED'])
			.is('deleted_at', null)

		if (pendingError) throw pendingError

		const pendingOrders = pendingCount ?? 0
		let unreadMessages = 0

		// Only conversations that belong to this store
		const { data: storeConversations, error: convError } = await supabase
			.from('conversations')
			.select('id')
			.eq('store_id', storeId)
			.is('deleted_at', null)

		if (convError) throw convError

		const convIds = (storeConversations ?? []).map((c) => c.id as string)

		if (convIds.length > 0) {
			const { data: participants, error: partError } = await supabase
				.from('conversation_participants')
				.select('conversation_id, last_read_at')
				.eq('user_id', ownerId)
				.in('conversation_id', convIds)

			if (partError) throw partError

			const readMap = new Map(
				(participants ?? []).map((c) => [
					c.conversation_id as string,
					c.last_read_at as string | null,
				])
			)

			// Unread for the seller = buyer messages (store_id IS NULL)
			const { data: messages, error: msgError } = await supabase
				.from('messages')
				.select('conversation_id, created_at')
				.in('conversation_id', convIds)
				.is('store_id', null)
				.is('deleted_at', null)

			if (msgError) throw msgError

			const unread = new Set<string>()
			for (const msg of messages ?? []) {
				const conversationId = msg.conversation_id as string
				const lastRead = readMap.get(conversationId)
				const createdAt = msg.created_at as string | null
				if (
					createdAt &&
					(!lastRead || new Date(createdAt) > new Date(lastRead))
				) {
					unread.add(conversationId)
				}
			}
			unreadMessages = unread.size
		}

		return NextResponse.json({ pendingOrders, unreadMessages })
	} catch (error) {
		console.error('[GET /api/seller/unread-counts]', error)
		return NextResponse.json(
			{ pendingOrders: 0, unreadMessages: 0 },
			{ status: 200 }
		)
	}
}
