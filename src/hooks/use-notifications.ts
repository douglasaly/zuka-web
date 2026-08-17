'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
	getNotifications,
	markNotificationsRead,
} from '@/lib/api/notifications'
import { useUserProfile } from './use-user-profile'
export function useNotifications() {
	const queryClient = useQueryClient()
	const { isAuthenticated } = useUserProfile()
	const { data, isLoading } = useQuery({
		queryKey: ['notifications', 'recent'],
		queryFn: () => getNotifications(),
		enabled: isAuthenticated,
		refetchInterval: 60000 * 3,
	})
	const markRead = useMutation({
		mutationFn: markNotificationsRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success('Notificações marcadas como lidas')
		},
		onError: () => {
			toast.error('Erro ao marcar notificações como lidas')
		},
	})
	return {
		notifications: data?.notifications ?? [],
		unreadCount: data?.unreadCount ?? 0,
		isLoading,
		markRead,
	}
}
