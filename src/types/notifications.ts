export interface Notification {
	id: string
	userId: string
	title: string
	body: string
	type: string
	link: string | null
	readAt: string | null
	createdAt: string
}

export interface NotificationRow {
	id: string
	user_id: string
	title: string
	body: string
	type: string
	link: string | null
	read_at: string | null
	created_at: string
	deleted_at: string | null
}
