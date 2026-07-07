'use client'

import { useQuery } from '@tanstack/react-query'
import type { InboxItem } from '@/types/messages'
import { useUserProfile } from './use-user-profile'

export const useInbox = () => {
	const { isAuthenticated, profile } = useUserProfile()

	const { data, isLoading } = useQuery({
		queryKey: ['inbox', profile?.id],
		queryFn: async () => {
			const res = await fetch('/api/conversations', {
				credentials: 'include',
			})
			if (!res.ok) throw new Error('Failed to fetch inbox')
			const json: { data: InboxItem[]; hasMore: boolean } =
				await res.json()
			return json
		},
		refetchInterval: 5000,
		enabled: isAuthenticated,
	})

	const conversations = data?.data ?? []
	const hasMore = data?.hasMore ?? false

	const unreadTotal = conversations.reduce(
		(acc, c) => acc + (c.unreadCount ?? 0),
		0
	)

	return { conversations, isLoading, unreadTotal, hasMore }
}
