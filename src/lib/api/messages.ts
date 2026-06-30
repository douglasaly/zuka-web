export async function GetMessages(cursor?: string | null) {
	const url = new URL('/api/messages', window.location.origin)

	if (cursor) {
		url.searchParams.set('cursor', cursor)
	}

	const res = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	})

	if (!res.ok) {
		throw new Error('Failed to fetch messages')
	}

	return res.json()
}

export async function GetConversationMessages(conversationId: string) {
	const res = await fetch(`/api/messages?conversationId=${conversationId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	})

	if (!res.ok) {
		throw new Error('Failed to fetch messages')
	}

	return await res.json()
}

export async function GetConversations(cursor?: string) {
	const url = new URL('/api/messages/conversations', window.location.origin)

	if (cursor) {
		url.searchParams.set('cursor', cursor)
	}

	const res = await fetch(url.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	})

	if (!res.ok) {
		throw new Error('Failed to fetch conversations')
	}

	return res.json()
}
