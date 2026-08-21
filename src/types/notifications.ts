export interface Notification {
	id: string
	userId: string
	type: NotificationType
	title: string
	body: string
	link: string | null
	readAt: string | null
	createdAt: string
	sender: NotificationSender | null
}
export type NotificationType =
	| 'message'
	| 'order'
	| 'offer'
	| 'follow'
	| 'review'
	| 'system'
	| 'promotion'
export type NotificationSender = {
	type: 'user' | 'store'
	id: string
	name: string
	avatarUrl: string | null
}
export interface NotificationRow {
	id: string
	user_id: string
	type: NotificationType
	title: string
	body: string
	link: string | null
	read_at: string | null
	created_at: string
	sender_user: {
		id: string
		first_name: string
		last_name: string
		avatar_url: string | null
	} | null
	sender_store: {
		id: string
		name: string
		logo_url: string | null
	} | null
}

export type ListNotificationsInput = {
	limit?: number
	offset?: number
	cursor?: string
}
export type ListNotificationsOutput = {
	success: true
	notifications: Notification[]
	unreadCount: number
	pagination: {
		limit: number
		offset: number
		hasMore: boolean
		nextCursor: string | null
	}
}
export type UpdateNotificationsInput =
	| {
			all: true
	  }
	| {
			ids: string[]
			read?: boolean
	  }
	| {
			ids: string[]
			restore: true
	  }
export type DeleteNotificationsInput = {
	ids: string[]
}
export type NotificationMutationOutput = {
	success: true
}
export type ListSellerNotificationsOutput = ListNotificationsOutput
export type MarkSellerNotificationsReadOutput = NotificationMutationOutput
export type AdminNotificationBatch = {
	id: string
	title: string
	body: string
	type: string
	created_at: string
	recipientCount: number
	readCount: number
}
export type ListAdminNotificationsOutput = {
	notifications: AdminNotificationBatch[]
}
export type SendNotificationInput = {
	target: 'buyers' | 'sellers' | 'all'
	title: string
	body: string
}
export type SendNotificationOutput = {
	success: true
	notification: {
		id: string
		target: string
		title: string
		body: string
		sentAt: string
		sentBy: string
	}
	recipientCount: number
}
