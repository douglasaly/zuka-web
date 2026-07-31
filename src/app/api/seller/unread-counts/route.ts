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

		const { store, user } = auth
		const supabase = createSupabaseAdmin()
		const storeId = store.id as string

		const { count: pendingCount } = await supabase
			.from('orders')
			.select('*', { count: 'exact', head: true })
			.eq('store_id', storeId)
			.eq('status', 'PENDING' as const)
			.is('deleted_at', null)

		const pendingOrders = pendingCount ?? 0
		let unreadMessages = 0

		const { data: conversations } = await supabase
			.from('conversation_participants')
			.select('conversation_id, last_read_at')
			.eq('user_id', user.id as string)

		if (conversations && conversations.length > 0) {
			const convIds = conversations.map((c) => c.conversation_id)
			const readMap = new Map(
				conversations.map((c) => [
					c.conversation_id,
					c.last_read_at,
				])
			)

			const { data: messages } = await supabase
				.from('messages')
				.select('conversation_id, created_at')
				.in('conversation_id', convIds)
				.eq('store_id', storeId)
				.is('deleted_at', null)

			if (messages) {
				const unread = new Set<string>()
				for (const msg of messages as Array<{
					conversation_id: string
					created_at: string
				}>) {
					const lastRead = readMap.get(msg.conversation_id)
					if (
						!lastRead ||
						new Date(msg.created_at) >
							new Date(lastRead as string)
					) {
						unread.add(msg.conversation_id)
					}
				}
				unreadMessages = unread.size
			}
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
