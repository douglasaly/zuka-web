// ─── Conversation routes (buyer + seller) ──────────────

export type Message = {
	id: string
	conversation_id: string
	user_id: string | null
	store_id: string | null
	content: string
	status: string
	created_at: string
	updated_at: string | null
	deleted_at: string | null
}

export type ConversationStore = {
	id: string | null
	name: string
	logoUrl: string | null
	slug: string | null
}

/** GET /api/conversations */
export type ConversationItem = {
	conversationId: string
	productId: string | null
	lastMessageAt: string
	lastMessage: string | null
	isLastMessageMine: boolean
	unreadCount: number
	store: ConversationStore
}

export type ListConversationsOutput = {
	success: true
	data: ConversationItem[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}

/** POST /api/conversations */
export type CreateConversationInput = {
	productId: string
	content?: string
}

export type CreateConversationOutput = {
	success: true
	data: {
		conversationId: string
	}
}

/** GET /api/conversations/[id] */
export type GetConversationOutput = {
	data: {
		conversationId: string
		productId: string | null
		store: {
			id: string
			name: string
			logoUrl: string | null
			slug: string
			state: string
			provinceName: string | null
		}
	}
}

/** GET /api/conversations/[id]/messages */
export type ListMessagesOutput = {
	success: true
	data: Message[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}

/** POST /api/conversations/[id]/messages */
export type SendMessageInput = {
	content: string
}

export type SendMessageOutput = {
	success: true
	data: Message
}

/** PATCH /api/conversations/[id]/read */
export type MarkConversationReadOutput = {
	success: true
}

// ─── Store conversations (seller side) ─────────────────

export type StoreConversationItem = {
	id: string
	otherUserName: string
	otherUserAvatar: string | null
	lastMessage: string | null
	lastMessageAt: string | null
	unread: boolean
}

/** GET /api/stores/conversations (cursor-based) */
export type ListStoreConversationsOutput = {
	success: true
	data: StoreConversationItem[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}

/** GET /api/stores/conversations/[id]/messages (cursor-based) */
export type ListStoreMessagesOutput = {
	success: true
	data: Message[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}

/** POST /api/stores/conversations/[id]/messages */
export type SendStoreMessageInput = {
	content: string
}

export type SendStoreMessageOutput = {
	success: true
	data: Message
}

/** PATCH /api/stores/conversations/[id]/read */
export type MarkStoreConversationReadOutput = {
	success: true
}
