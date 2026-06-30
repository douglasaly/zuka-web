import type { FollowedStores } from '@/types/stores'

type FollowStoreResponse = {
	success: boolean
	action: 'followed' | 'unfollowed'
	storeId: string
}

export async function followStore(
	storeId: string
): Promise<FollowStoreResponse> {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 10000)

	try {
		const res = await fetch(`/api/stores/${storeId}/follow`, {
			method: 'POST',
			credentials: 'include',
			signal: controller.signal,
			headers: {
				'Content-Type': 'application/json',
			},
		})

		const json = await res.json().catch(() => null)

		if (!res.ok) {
			throw new Error(json?.error ?? 'Failed to follow store')
		}

		return json as FollowStoreResponse
	} finally {
		clearTimeout(timeout)
	}
}

export async function isFollowing(storeId: string): Promise<boolean> {
	const res = await fetch(`/api/stores/${storeId}/is-following`, {
		method: 'GET',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
	})

	const json = await res.json().catch(() => ({ isFollowing: false }))

	if (!res.ok) {
		return false
	}

	return json.isFollowing
}
export async function unfollowStore(storeId: string) {
	const res = await fetch(`/api/stores/${storeId}/follow`, {
		method: 'DELETE',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
	})

	if (!res.ok) {
		const json = await res.json().catch(() => null)
		throw new Error(json?.error ?? 'Failed to unfollow')
	}

	return res.json()
}

type QueryKey = ['followed-stores', { cursor?: string; limit?: number }]

export async function getFollowedStores({
	queryKey,
	signal,
}: {
	queryKey: QueryKey
	signal?: AbortSignal
}): Promise<FollowedStores> {
	const [, params] = queryKey

	const searchParams = new URLSearchParams()

	if (params?.cursor) searchParams.append('cursor', params.cursor)
	if (params?.limit) searchParams.append('limit', String(params.limit))

	const res = await fetch(`/api/stores/followed?${searchParams.toString()}`, {
		credentials: 'include',
		signal,
	})

	if (!res.ok) {
		throw new Error('Failed to fetch followed stores')
	}

	return res.json()
}
