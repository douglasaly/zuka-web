import type { NextRequest } from 'next/server'
import { uuidv7 } from 'uuidv7'
import type { RouteContext } from '@/lib/api-handler'
import {
	apiCursorList,
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/api-response'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { CursorPaginationSchema, SendMessageSchema } from '@/lib/validations'
export const GET = withErrorHandling(
	async (request: NextRequest, { params }: RouteContext) => {
		const { id: conversationId } = await params
		const auth = await requireSellerStore({ permission: 'message.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const { searchParams } = new URL(request.url)
		const { limit, cursor } = CursorPaginationSchema.parse({
			limit: searchParams.get('limit') ?? undefined,
			cursor: searchParams.get('cursor') ?? undefined,
		})
		const supabase = createSupabaseAdmin()
		const { data: conversation } = await supabase
			.from('conversations')
			.select('id')
			.eq('id', conversationId)
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.single()
		if (!conversation) {
			return apiError(ErrorCode.NOT_FOUND, 'Conversa não encontrada', 404)
		}
		let query = supabase
			.from('messages')
			.select(
				'id, conversation_id, user_id, store_id, content, status, created_at'
			)
			.eq('conversation_id', conversationId)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(limit + 1)
		if (cursor) {
			query = query.lt('created_at', cursor)
		}
		const { data, error } = await query
		if (error) throw error
		const hasMore = (data?.length ?? 0) > limit
		const pageDesc = hasMore ? (data?.slice(0, limit) ?? []) : (data ?? [])
		const messages = [...pageDesc].reverse()
		const nextCursor = hasMore ? (messages[0]?.created_at ?? null) : null
		return apiCursorList(messages, { hasMore, nextCursor, limit })
	}
)
export const POST = withErrorHandling(
	async (request: NextRequest, { params }: RouteContext) => {
		const { id: conversationId } = await params
		const auth = await requireSellerStore({ permission: 'message.write' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const supabase = createSupabaseAdmin()
		const { data: conversation } = await supabase
			.from('conversations')
			.select('id')
			.eq('id', conversationId)
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.single()
		if (!conversation) {
			return apiError(ErrorCode.NOT_FOUND, 'Conversa não encontrada', 404)
		}
		const body = await request.json()
		const parsed = SendMessageSchema.safeParse(body)
		if (!parsed.success) {
			return apiError(
				ErrorCode.VALIDATION_ERROR,
				parsed.error.issues[0]?.message ?? 'Conteúdo é obrigatório'
			)
		}
		const messageId = uuidv7()
		const { data: message, error: msgError } = await supabase
			.from('messages')
			.insert({
				id: messageId,
				conversation_id: conversationId,
				user_id: null,
				store_id: store.id,
				content: parsed.data.content.trim(),
			})
			.select(
				'id, conversation_id, user_id, store_id, content, status, created_at'
			)
			.single()
		if (msgError) throw msgError
		const { error: updateError } = await supabase
			.from('conversations')
			.update({
				last_message_at: new Date().toISOString(),
				last_message_id: messageId,
			})
			.eq('id', conversationId)
		if (updateError) throw updateError
		return apiSuccess(message, 201)
	}
)
