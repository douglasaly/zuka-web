import { requireConversationParticipant } from '@/lib/auth'
import {
	apiCursorList,
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { CursorPaginationSchema, SendMessageSchema } from '@/lib/validations'
export const GET = withErrorHandling(async (request, { params }) => {
	const { id: conversationId } = await params
	await requireConversationParticipant(conversationId)
	const { searchParams } = new URL(request.url)
	const { limit, cursor } = CursorPaginationSchema.parse({
		limit: searchParams.get('limit') ?? undefined,
		cursor: searchParams.get('cursor') ?? undefined,
	})
	const supabase = createSupabaseAdmin()
	let query = supabase
		.from('messages')
		.select(
			'id, conversation_id, user_id, store_id, content, status, created_at, updated_at, deleted_at'
		)
		.eq('conversation_id', conversationId)
		.is('deleted_at', null)
		.order('created_at', { ascending: true })
		.limit(limit + 1)
	if (cursor) {
		query = query.gt('created_at', cursor)
	}
	const { data, error } = await query
	if (error) throw error
	const hasMore = (data?.length ?? 0) > limit
	const messages = hasMore ? data?.slice(0, limit) : (data ?? [])
	const nextCursor = hasMore
		? (messages[messages.length - 1]?.created_at ?? null)
		: null
	return apiCursorList(messages, { hasMore, nextCursor, limit })
})
export const POST = withErrorHandling(async (request, { params }) => {
	const { id: conversationId } = await params
	const auth = await requireConversationParticipant(conversationId)
	const body = await request.json()
	const parsed = SendMessageSchema.safeParse(body)
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0].message
		)
	}
	const { content } = parsed.data
	const supabase = createSupabaseAdmin()
	const { data: message, error } = await supabase
		.from('messages')
		.insert({
			id: crypto.randomUUID(),
			conversation_id: conversationId,
			user_id: auth.user.id,
			store_id: null,
			content,
		})
		.select(
			'id, conversation_id, user_id, store_id, content, status, created_at, updated_at, deleted_at'
		)
		.single()
	if (error) throw error
	await supabase
		.from('conversations')
		.update({ last_message_at: new Date().toISOString() })
		.eq('id', conversationId)
	return apiSuccess(message, 201)
})
