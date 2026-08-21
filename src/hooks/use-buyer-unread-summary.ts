'use client'

import { useQuery } from '@tanstack/react-query'
import { useUserProfile } from '@/hooks/use-user-profile'
import type { NotificationType } from '@/types'

export type BuyerUnreadSummary = {
	total: number
	byType: Record<NotificationType, number>
}

const EMPTY: BuyerUnreadSummary = {
	total: 0,
	byType: {
		order: 0,
		message: 0,
		promotion: 0,
		offer: 0,
		follow: 0,
		review: 0,
		system: 0,
	},
}

export function useBuyerUnreadSummary() {
	const { isAuthenticated, profile } = useUserProfile()
	return useQuery<BuyerUnreadSummary>({
		queryKey: ['buyer-unread-summary', profile?.id],
		queryFn: async () => {
			const res = await fetch('/api/notifications/unread-summary', {
				credentials: 'include',
			})
			if (!res.ok) return EMPTY
			const json = (await res.json()) as Partial<BuyerUnreadSummary>
			return {
				total: Number(json.total) || 0,
				byType: { ...EMPTY.byType, ...(json.byType ?? {}) },
			}
		},
		enabled: isAuthenticated,
		refetchInterval: 30000,
		staleTime: 10000,
	})
}
