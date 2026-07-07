import { type NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { searchParams } = new URL(request.url)
		const page = Math.max(Number(searchParams.get('page')) || 1, 1)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit')) || 10, 1),
			100
		)
		const from = (page - 1) * limit
		// Trazer o limit+1 items para detectar se há `hasMore`(mais items para carregar)
		const rangeEnd = from + limit // .range() é inclusivo, então não subtrair 1

		// buscar conversas através da tabela `conversations` e `conversation_participants`
		const { data: conversations, error } = await supabase
			.from('conversations')
			.select(`
				id,
				last_message_at,
				last_message_id,
				product_id,
				stores (
					id,
					name,
					logo_url,
					slug
				),
				conversation_participants!inner (
					user_id,
					last_read_at
				)
			`)
			.eq('conversation_participants.user_id', user.id)
			.is('deleted_at', null)
			.order('last_message_at', { ascending: false })
			.range(from, rangeEnd)

		if (error) throw error

		const pageItems = (conversations ?? []).slice(0, limit)
		const hasMore = (conversations?.length ?? 0) > limit

		const conversationIds = pageItems.map((c) => c.id) ?? []
		const lastMessageIds = pageItems
			.map((c) => c.last_message_id)
			.filter(Boolean) as string[]

		// buscar conteúdo da última mensagen
		// Se user_id preenchido = enviada pelo comprador
		// Se store_id preenchido = enviada pela loja
		const { data: lastMessages } = await supabase
			.from('messages')
			.select('id, content, user_id, store_id')
			.in('id', lastMessageIds)

		const lastMessageMap = (lastMessages ?? []).reduce<
			Record<
				string,
				{
					content: string
					user_id: string | null
					store_id: string | null
				}
			>
		>((acc, m) => {
			acc[m.id] = {
				content: m.content,
				user_id: m.user_id,
				store_id: m.store_id,
			}
			return acc
		}, {})

		// Unread count — mensagens enviadas pela loja (store_id IS NOT NULL)
		// que o utilizador ainda não leu (criadas após last_read_at)
		const { data: unreadData } = await supabase
			.from('messages')
			.select('conversation_id')
			.in('conversation_id', conversationIds)
			.not('store_id', 'is', null) // enviadas pela loja
			.is('deleted_at', null)

		const unreadMap = (unreadData ?? []).reduce<Record<string, number>>(
			(acc, msg) => {
				acc[msg.conversation_id] = (acc[msg.conversation_id] ?? 0) + 1
				return acc
			},
			{}
		)

		// Montar inbox (caixa de mensagens) para o utilizador
		const inbox =
			pageItems.map((c) => {
				const lastMsg = c.last_message_id
					? lastMessageMap[c.last_message_id]
					: null

				return {
					conversationId: c.id,
					productId: c.product_id ?? null,
					lastMessageAt: c.last_message_at,
					lastMessage: lastMsg?.content ?? null,
					isLastMessageMine: lastMsg?.user_id === user.id,
					unreadCount: unreadMap[c.id] ?? 0,
					store: {
						id: c.stores?.id ?? null,
						name: c.stores?.name ?? 'Loja',
						logoUrl: c.stores?.logo_url ?? null,
						slug: c.stores?.slug ?? null,
					},
				}
			}) ?? []

		return NextResponse.json({ data: inbox, hasMore })
	} catch (err) {
		console.error('[GET /api/conversations]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
