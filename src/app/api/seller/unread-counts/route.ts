import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { getUserRoles } from '@/lib/auth/roles'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json(
				{ pendingOrders: 0, unreadMessages: 0 },
				{ status: 200 }
			)
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json(
				{ pendingOrders: 0, unreadMessages: 0 },
				{ status: 200 }
			)
		}

		const supabase = createSupabaseAdmin()

		const { data: sellerProfile } = await supabase
			.from('seller_profiles')
			.select('id')
			.eq('user_id', user.id as string)
			.maybeSingle()

		if (!sellerProfile) {
			return NextResponse.json(
				{ pendingOrders: 0, unreadMessages: 0 },
				{ status: 200 }
			)
		}

		const { data: stores } = await supabase
			.from('stores')
			.select('id')
			.eq('seller_profile_id', sellerProfile.id as string)
			.is('deleted_at', null)

		const storeIds = (stores ?? []).map((s) => s.id as string)

		let pendingOrders = 0
		let unreadMessages = 0

		if (storeIds.length > 0) {
			const { count: pendingCount } = await supabase
				.from('orders')
				.select('*', { count: 'exact', head: true })
				.in('store_id', storeIds)
				.eq('status', 'PENDING' as const)
				.is('deleted_at', null)

			pendingOrders = pendingCount ?? 0

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
					.is('deleted_at', null)
					.not('store_id', 'is', null)

				if (messages) {
					const unread = new Set<string>()
					for (const msg of messages as any[]) {
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
