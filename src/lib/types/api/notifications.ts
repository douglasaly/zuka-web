import type { Notification, NotificationSender } from '@/types/notifications'
export type { Notification, NotificationSender }
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
