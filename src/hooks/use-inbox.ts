'use client'
import { useQuery } from '@tanstack/react-query'
import type { InboxItem } from '@/types'
import { useUserProfile } from './use-user-profile'
export const useInbox = () => {
	const {
		isAuthenticated,
		isLoading: isAuthLoading,
		profile,
	} = useUserProfile()
	const { data, isLoading } = useQuery({
		queryKey: ['inbox', profile?.id],
		queryFn: async () => {
			const res = await fetch('/api/conversations', {
				credentials: 'include',
			})
			if (!res.ok) throw new Error('Failed to fetch inbox')
			const json: {
				data: InboxItem[]
				pagination?: {
					hasMore: boolean
				}
			} = await res.json()
			return json
		},
		refetchInterval: 5000,
		enabled: isAuthenticated,
	})
	const conversations = data?.data ?? []
	const hasMore = data?.pagination?.hasMore ?? false
	const unreadTotal = conversations.reduce(
		(acc, c) => acc + (c.unreadCount ?? 0),
		0
	)
	return {
		conversations,
		isLoading: isAuthLoading || isLoading,
		unreadTotal,
		hasMore,
	}
}
