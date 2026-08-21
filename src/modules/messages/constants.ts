export type Conversation = {
	id: string
	storeName: string
	storeAvatarUrl: string
	lastMessage: string
	timestamp: string
	unreadCount: number
}

export type MessageStatus = 'sent' | 'delivered' | 'read'
export type ChatMessage = {
	id: string
	conversationId: string
	userId: string | null
	storeId: string | null
	content: string
	status: MessageStatus
	createdAt: string
	updatedAt: string
	deletedAt: string | null
}