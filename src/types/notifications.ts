export interface Notification {
	id: string
	userId: string
	type: NotificationType
	title: string
	body: string
	link: string | null
	readAt: string | null
	createdAt: string
}

export type NotificationType =
	| 'message'
	| 'order'
	| 'offer'
	| 'follow'
	| 'review'
	| 'system'
	| 'promotion'

export interface NotificationRow {
	id: string
	user_id: string
	title: string
	body: string
	type: NotificationType
	link: string | null
	read_at: string | null
	created_at: string
	deleted_at: string | null
}
