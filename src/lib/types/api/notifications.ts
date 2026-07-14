// ─── Notification routes ───────────────────────────────

import type { NotificationType } from '@/types/notifications'

export type NotificationSender = {
	type: 'user' | 'store'
	id: string
	name: string
	avatarUrl: string | null
}

export type NotificationItem = {
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

/** GET /api/notifications */
export type ListNotificationsInput = {
	limit?: number
	offset?: number
}

export type ListNotificationsOutput = {
	success: true
	notifications: NotificationItem[]
	unreadCount: number
	pagination: {
		limit: number
		offset: number
		hasMore: boolean
	}
}

/** PATCH /api/notifications */
export type MarkNotificationsReadInput = {
	ids: string[]
}

export type MarkNotificationsReadOutput = {
	success: true
}

/** GET /api/seller/notifications */
export type ListSellerNotificationsOutput = ListNotificationsOutput

/** PATCH /api/seller/notifications */
export type MarkSellerNotificationsReadOutput = {
	success: true
}

/** GET /api/admin/notifications */
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

/** POST /api/admin/notifications */
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
