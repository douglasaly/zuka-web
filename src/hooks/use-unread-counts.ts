'use client'
import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from './use-user-profile'
export type UnreadCounts = {
	pendingOrders: number
	unreadMessages: number
}
export function useUnreadCounts(options?: { enabled?: boolean }) {
	const { isAuthenticated, profile } = useUserProfile()
	const enabled =
		isAuthenticated && (options?.enabled === undefined || options.enabled)
	return useQuery<UnreadCounts>({
		queryKey: ['unread-counts', profile?.id],
		queryFn: async () => {
			const res = await fetch('/api/seller/unread-counts', {
				credentials: 'include',
			})
			if (!res.ok) {
				return { pendingOrders: 0, unreadMessages: 0 }
			}
			const json = (await res.json()) as Partial<UnreadCounts>
			return {
				pendingOrders: Number(json.pendingOrders) || 0,
				unreadMessages: Number(json.unreadMessages) || 0,
			}
		},
		enabled,
		refetchInterval: 30000,
		staleTime: 10000,
	})
}
