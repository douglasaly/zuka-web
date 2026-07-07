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
