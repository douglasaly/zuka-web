export async function getNotifications(limit = 5) {
	const res = await fetch(`/api/notifications?limit=${limit}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to fetch')
	return res.json()
}

export async function markNotificationsRead(ids: string[]) {
	const res = await fetch('/api/notifications', {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
	})
	if (!res.ok) throw new Error('Failed')
}
