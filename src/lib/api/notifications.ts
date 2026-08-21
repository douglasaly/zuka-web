import type {
	ListNotificationsOutput,
	UpdateNotificationsInput,
} from '@/types'
export async function getNotifications(limit = 5, page: number | string = 0) {
	const params = new URLSearchParams({
		limit: String(limit),
	})
	if (typeof page === 'string' && page) {
		params.set('cursor', page)
	} else {
		params.set('offset', String(typeof page === 'number' ? page : 0))
	}
	const res = await fetch(`/api/notifications?${params}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to fetch')
	return (await res.json()) as ListNotificationsOutput
}
async function patchNotifications(body: UpdateNotificationsInput) {
	const res = await fetch('/api/notifications', {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) throw new Error('Failed')
}
export function markNotificationsRead(ids: string[]) {
	return patchNotifications({ ids, read: true })
}
export function setNotificationsRead(ids: string[], read: boolean) {
	return patchNotifications({ ids, read })
}
export function markAllNotificationsRead() {
	return patchNotifications({ all: true })
}
export function restoreNotifications(ids: string[]) {
	return patchNotifications({ ids, restore: true })
}
export async function deleteNotifications(ids: string[]) {
	const res = await fetch('/api/notifications', {
		method: 'DELETE',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
	})
	if (!res.ok) throw new Error('Failed')
}
