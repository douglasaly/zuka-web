import { type NextRequest, NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
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
			.select('conversation_id, created_at')
			.in('conversation_id', conversationIds)
			.not('store_id', 'is', null) // enviadas pela loja
			.is('deleted_at', null)

		const lastReadAtByConversation = pageItems.reduce<
			Record<string, string | null>
		>((acc, c) => {
			const participant = Array.isArray(c.conversation_participants)
				? c.conversation_participants[0]
				: c.conversation_participants

			acc[c.id] = participant?.last_read_at ?? null
			return acc
		}, {})

		const unreadMap = (unreadData ?? [])
			.filter((msg) => {
				const lastReadAt = lastReadAtByConversation[msg.conversation_id]
				return (
					msg.created_at != null &&
					(lastReadAt ? msg.created_at > lastReadAt : true)
				)
			})
			.reduce<Record<string, number>>((acc, msg) => {
				acc[msg.conversation_id] = (acc[msg.conversation_id] ?? 0) + 1
				return acc
			}, {})

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

export async function POST(request: NextRequest) {
	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { productId, content } = await request.json()

		if (!productId) {
			return NextResponse.json(
				{ error: 'productId is required' },
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()

		// Buscar o produto para obter a loja
		const { data: product } = await supabase
			.from('products')
			.select('store_id')
			.eq('id', productId)
			.is('deleted_at', null)
			.single()

		if (!product) {
			return NextResponse.json(
				{ error: 'Product not found' },
				{ status: 404 }
			)
		}

		const storeId = product.store_id

		// Buscar o dono da loja
		const { data: store } = await supabase
			.from('stores')
			.select('owner_id')
			.eq('id', storeId)
			.single()

		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		// Verificar se já existe uma conversa entre o comprador e a loja
		const { data: userParticipations } = await supabase
			.from('conversation_participants')
			.select('conversation_id')
			.eq('user_id', user.id)

		const userConvIds =
			(userParticipations ?? []).map((p) => p.conversation_id) ?? []

		let conversationId: string | null = null

		if (userConvIds.length > 0) {
			const { data: shared } = await supabase
				.from('conversation_participants')
				.select('conversation_id')
				.eq('user_id', store.owner_id)
				.in('conversation_id', userConvIds)
				.limit(1)

			const sharedId = shared?.[0]?.conversation_id

			if (sharedId) {
				// Confirmar que a conversa não foi eliminada
				const { data: conv } = await supabase
					.from('conversations')
					.select('id')
					.eq('id', sharedId)
					.is('deleted_at', null)
					.single()

				if (conv) conversationId = conv.id
			}
		}

		if (!conversationId) {
			// Criar nova conversa
			conversationId = uuidv7()

			const { error: convError } = await supabase
				.from('conversations')
				.insert({
					id: conversationId,
					product_id: productId,
					store_id: storeId,
				})

			if (convError) throw convError

			// Adicionar participantes (comprador + loja)
			const { error: partError } = await supabase
				.from('conversation_participants')
				.insert([
					{ conversation_id: conversationId, user_id: user.id },
					{
						conversation_id: conversationId,
						user_id: store.owner_id,
					},
				])

			if (partError) throw partError
		}

		// Enviar mensagem inicial apenas se houver conteúdo
		if (content?.trim()) {
			const messageId = uuidv7()
			const { error: msgError } = await supabase.from('messages').insert({
				id: messageId,
				conversation_id: conversationId,
				user_id: user.id,
				store_id: null,
				content: content.trim(),
			})

			if (msgError) throw msgError

			// Actualizar last_message_at e last_message_id na conversa
			const { error: updateError } = await supabase
				.from('conversations')
				.update({
					last_message_at: new Date().toISOString(),
					last_message_id: messageId,
				})
				.eq('id', conversationId)

			if (updateError) throw updateError
		}

		return NextResponse.json({ data: { conversationId } }, { status: 201 })
	} catch (err) {
		console.error('[POST /api/conversations]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
