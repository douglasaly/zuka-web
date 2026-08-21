export type InboxItem = {
	conversationId: string
	productId: string | null
	lastMessageAt: string | null
	lastMessage: string | null
	isLastMessageMine: boolean
	unreadCount: number
	store: {
		id: string | null
		name: string
		logoUrl: string | null
		slug: string | null
	}
}

export type SellerConversation = {
	id: string
	otherUserName: string
	otherUserAvatar: string | null
	lastMessage: string | null
	lastMessageAt: string | null
	unread: boolean
}

export type SellerConversationMessage = {
	id: string
	conversation_id: string
	user_id: string | null
	store_id: string | null
	content: string
	status: string
	created_at: string
}

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
export type ListMessagesOutput = {
	success: true
	data: Message[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}
export type SendMessageInput = {
	content: string
}
export type SendMessageOutput = {
	success: true
	data: Message
}
export type MarkConversationReadOutput = {
	success: true
}
export type StoreConversationItem = {
	id: string
	otherUserName: string
	otherUserAvatar: string | null
	lastMessage: string | null
	lastMessageAt: string | null
	unread: boolean
}
export type ListStoreConversationsOutput = {
	success: true
	data: StoreConversationItem[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}
export type ListStoreMessagesOutput = {
	success: true
	data: Message[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
}
export type SendStoreMessageInput = {
	content: string
}
export type SendStoreMessageOutput = {
	success: true
	data: Message
}
export type MarkStoreConversationReadOutput = {
	success: true
}
