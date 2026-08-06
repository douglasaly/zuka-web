import { uuidv7 } from 'uuidv7'
import {
	apiCursorList,
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/api-response'
import { requireAuth } from '@/lib/auth'
import { getManagedStoreIds } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	CreateConversationSchema,
	CursorPaginationSchema,
} from '@/lib/validations'

// ─── GET /api/conversations ──────────────────────────────
// Lista conversas do utilizador autenticado (vista buyer).
// Exclui conversas de lojas que o user gere (dono/membro) — essas ficam no dashboard.

export const GET = withErrorHandling(async (request) => {
	const auth = await requireAuth()

	const { searchParams } = new URL(request.url)
	const { limit, cursor } = CursorPaginationSchema.parse({
		limit: searchParams.get('limit') ?? undefined,
		cursor: searchParams.get('cursor') ?? undefined,
	})

	const supabase = createSupabaseAdmin()
	const managedStoreIds = await getManagedStoreIds(auth.user.id)

	// Cursor-based: filtra por last_message_at < cursor
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
		.limit(limit + 1) // +1 para detectar hasMore

	// Não misturar inbox do vendedor com a vista de comprador
	if (managedStoreIds.length > 0) {
		query = query.not(
			'store_id',
			'in',
			`(${managedStoreIds.join(',')})`
		)
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

	// Batch fetch: last messages + unread counts
	const lastMessageIds = pageItems
		.map((c) => c.last_message_id)
		.filter(Boolean) as string[]
	const conversationIds = pageItems.map((c) => c.id)

	const [lastMessagesResult, unreadResult] = await Promise.all([
		lastMessageIds.length > 0
			? supabase
					.from('messages')
					.select('id, content, user_id, store_id')
					.in('id', lastMessageIds)
			: Promise.resolve({ data: [] }),
		conversationIds.length > 0
			? supabase
					.from('messages')
					.select('conversation_id, created_at')
					.in('conversation_id', conversationIds)
					.not('store_id', 'is', null)
					.is('deleted_at', null)
			: Promise.resolve({ data: [] }),
	])

	// Mapas para lookup rápido
	const lastMessageMap = new Map(
		(lastMessagesResult.data ?? []).map((m) => [
			m.id,
			{ content: m.content, userId: m.user_id, storeId: m.store_id },
		])
	)

	const lastReadAtMap = new Map(
		pageItems.map((c) => {
			const participant = Array.isArray(c.conversation_participants)
				? c.conversation_participants[0]
				: c.conversation_participants
			return [c.id, participant?.last_read_at ?? null]
		})
	)

	// Calcular unread counts
	const unreadMap = new Map<string, number>()
	for (const msg of unreadResult.data ?? []) {
		const lastReadAt = lastReadAtMap.get(msg.conversation_id)
		if (msg.created_at && (!lastReadAt || msg.created_at > lastReadAt)) {
			unreadMap.set(
				msg.conversation_id,
				(unreadMap.get(msg.conversation_id) ?? 0) + 1
			)
		}
	}

	// Montar inbox
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

// ─── POST /api/conversations ─────────────────────────────
// Criar ou reutilizar conversa com uma loja (1 conversa por buyer+loja).

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

	// Buscar produto + loja numa query
	const { data: product } = await supabase
		.from('products')
		.select('store_id, stores!inner(owner_id)')
		.eq('id', productId)
		.is('deleted_at', null)
		.single()

	if (!product) {
		return apiError(ErrorCode.NOT_FOUND, 'Produto não encontrado')
	}

	const storeOwnerId = (product.stores as { owner_id: string }).owner_id
	const storeId = product.store_id as string

	// Conversas da própria loja (dono/membro) ficam só no dashboard do vendedor
	const managedStoreIds = await getManagedStoreIds(auth.user.id)
	if (managedStoreIds.includes(storeId)) {
		return apiError(
			ErrorCode.FORBIDDEN,
			'Não pode iniciar conversa com a sua própria loja neste ecrã. Use o dashboard.'
		)
	}

	// Uma conversa por buyer + loja: reutilizar a mais recente (activa ou soft-deleted)
	const { data: existingRows, error: existingError } = await supabase
		.from('conversations')
		.select(
			`
			id,
			deleted_at,
			conversation_participants!inner ( user_id )
		`
		)
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

		// Reabrir conversa soft-deleted em vez de criar outra
		if (existing.deleted_at) {
			updates.deleted_at = null
		}

		const { error: reviveError } = await supabase
			.from('conversations')
			.update(updates)
			.eq('id', conversationId)

		if (reviveError) throw reviveError

		// Garantir que o dono da loja continua como participante
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

	// Enviar mensagem inicial se houver conteúdo
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
