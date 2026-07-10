import { type NextRequest, NextResponse } from 'next/server'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(_request: NextRequest) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error
		const { store } = auth

		const supabase = createSupabaseAdmin()

		const { data: conversations } = await supabase
			.from('conversations')
			.select('id, last_message_at, last_message_id')
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.order('last_message_at', { ascending: false, nullsFirst: false })

		if (!conversations || conversations.length === 0) {
			return NextResponse.json({ data: [] })
		}

		const conversationIds = conversations.map((c) => c.id)

		// --- participantes ---
		const { data: participants } = await supabase
			.from('conversation_participants')
			.select('conversation_id, user_id, last_read_at')
			.in('conversation_id', conversationIds)

		const participantsByConversation = new Map(
			(participants ?? []).map((p) => [p.conversation_id, p])
		)

		// --- comprador (o participante que não é o dono da loja) ---
		const buyerIds: string[] = []
		const storeOwnerLastRead = new Map<string, string | null>()

		for (const conv of conversations) {
			const allParts = (participants ?? []).filter(
				(p) => p.conversation_id === conv.id
			)
			const ownerPart = allParts.find(
				(p) => p.user_id === store.owner_id
			)
			const buyerPart = allParts.find(
				(p) => p.user_id !== store.owner_id
			)
			if (ownerPart) storeOwnerLastRead.set(conv.id, ownerPart.last_read_at)
			if (buyerPart) buyerIds.push(buyerPart.user_id)
		}

		const { data: buyers } = await supabase
			.from('users')
			.select('id, first_name, last_name, avatar_url')
			.in('id', buyerIds)

		const buyerMap = new Map(
			(buyers ?? []).map((b) => [b.id, b])
		)

		// --- última mensagem ---
		const lastMessageIds = conversations
			.map((c) => c.last_message_id)
			.filter(Boolean) as string[]

		const lastMessageContentMap = new Map<string, string>()
		if (lastMessageIds.length > 0) {
			const { data: lastMessages } = await supabase
				.from('messages')
				.select('id, content')
				.in('id', lastMessageIds)
			for (const m of lastMessages ?? []) {
				lastMessageContentMap.set(m.id, m.content)
			}
		}

		// --- não lidas (mensagens do comprador com store_id IS NULL após last_read_at) ---
		const unreadConvs = new Set<string>()
		const { data: buyerMessages } = await supabase
			.from('messages')
			.select('conversation_id, created_at')
			.in('conversation_id', conversationIds)
			.is('store_id', null)
			.is('deleted_at', null)

		for (const msg of buyerMessages ?? []) {
			const lastRead = storeOwnerLastRead.get(msg.conversation_id)
			if (
				msg.created_at &&
				(!lastRead || msg.created_at > lastRead)
			) {
				unreadConvs.add(msg.conversation_id)
			}
		}

		// --- montar resposta ---
		const data = conversations.map((conv) => {
			const members = (participants ?? []).filter(
				(p) => p.conversation_id === conv.id
			)
			const buyerPart = members.find(
				(p) => p.user_id !== store.owner_id
			)
			const buyerUser = buyerPart
				? buyerMap.get(buyerPart.user_id)
				: null

			const firstName = buyerUser?.first_name ?? ''
			const lastName = buyerUser?.last_name ?? ''
			const name = [firstName, lastName].filter(Boolean).join(' ') || 'Cliente'

			return {
				id: conv.id,
				otherUserName: name,
				otherUserAvatar: buyerUser?.avatar_url ?? null,
				lastMessage: conv.last_message_id
					? lastMessageContentMap.get(conv.last_message_id) ?? null
					: null,
				lastMessageAt: conv.last_message_at,
				unread: unreadConvs.has(conv.id),
			}
		})

		return NextResponse.json({ data })
	} catch (err) {
		console.error('[GET /api/stores/conversations]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
