'use client'

import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from '@/hooks/use-user-profile'

export function useBuyerChatUnread() {
	const { isAuthenticated, profile } = useUserProfile()
	return useQuery({
		queryKey: ['buyer-chat-unread', profile?.id],
		queryFn: async () => {
			const res = await fetch('/api/conversations/unread-count', {
				credentials: 'include',
			})
			if (!res.ok) return 0
			const json = (await res.json()) as { unreadMessages?: number }
			return Number(json.unreadMessages) || 0
		},
		enabled: isAuthenticated,
		refetchInterval: 30000,
		staleTime: 10000,
	})
}
