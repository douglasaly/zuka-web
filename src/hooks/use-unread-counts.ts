'use client'

import { useQuery } from '@tanstack/react-query'

export type UnreadCounts = {
	pendingOrders: number
	unreadMessages: number
}

export function useUnreadCounts() {
	return useQuery<UnreadCounts>({
		queryKey: ['unread-counts'],
		queryFn: async () => {
			const res = await fetch('/api/seller/unread-counts')
			if (!res.ok) {
				return { pendingOrders: 0, unreadMessages: 0 }
			}
			const json = await res.json()
			return json as UnreadCounts
		},
		refetchInterval: 30_000,
		staleTime: 10_000,
	})
}
