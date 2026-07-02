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
	sender_store: { id: string; name: string; logo_url: string | null } | null
}
