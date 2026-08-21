'use client'
import {
	type InfiniteData,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
	deleteNotifications,
	getNotifications,
	markAllNotificationsRead,
	restoreNotifications,
	setNotificationsRead,
} from '@/lib/api/notifications'
import type { ListNotificationsOutput } from '@/types'
import type { Notification, NotificationType } from '@/types'
import { groupByDate } from '@/utils/group-by-date'
import { NOTIFICATION_TYPE_ORDER, type NotificationFilter } from '../constants'

const PAGE_SIZE = 20
const FEED_KEY = ['notifications', 'feed']
type FeedData = InfiniteData<ListNotificationsOutput, string>
function patchFeed(
	data: FeedData | undefined,
	update: (notification: Notification) => Notification | null
): FeedData | undefined {
	if (!data) return data
	let unreadDelta = 0
	const pages = data.pages.map((page) => {
		const notifications: Notification[] = []
		for (const item of page.notifications) {
			const next = update(item)
			if (!next) {
				if (!item.readAt) unreadDelta -= 1
				continue
			}
			if (!item.readAt && next.readAt) unreadDelta -= 1
			if (item.readAt && !next.readAt) unreadDelta += 1
			notifications.push(next)
		}
		return { ...page, notifications }
	})
	return {
		...data,
		pages: pages.map((page, index) =>
			index === 0
				? {
						...page,
						unreadCount: Math.max(
							0,
							page.unreadCount + unreadDelta
						),
					}
				: page
		),
	}
}
export function useNotificationsFeed() {
	const queryClient = useQueryClient()
	const { isAuthenticated, isLoading: isLoadingSession } = useUserProfile()
	const [filter, setFilter] = useState<NotificationFilter>('all')
	const query = useInfiniteQuery({
		queryKey: FEED_KEY,
		queryFn: ({ pageParam }) => getNotifications(PAGE_SIZE, pageParam),
		initialPageParam: '',
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore
				? (lastPage.pagination.nextCursor ?? undefined)
				: undefined,
		enabled: isAuthenticated,
	})
	const snapshot = async () => {
		await queryClient.cancelQueries({ queryKey: FEED_KEY })
		return queryClient.getQueryData<FeedData>(FEED_KEY)
	}
	const applyOptimistic = (
		update: (notification: Notification) => Notification | null
	) => {
		queryClient.setQueryData<FeedData>(FEED_KEY, (data) =>
			patchFeed(data, update)
		)
	}
	const rollback = (previous: FeedData | undefined) => {
		if (previous) queryClient.setQueryData(FEED_KEY, previous)
	}
	const settle = () => {
		void queryClient.invalidateQueries({
			queryKey: ['notifications', 'recent'],
		})
		void queryClient.invalidateQueries({
			queryKey: FEED_KEY,
			refetchType: 'none',
		})
	}
	const restore = useMutation({
		mutationFn: (notification: Notification) =>
			restoreNotifications([notification.id]),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success('Notificação recuperada.')
		},
		onError: () => toast.error('Não foi possível recuperar a notificação.'),
	})
	const setRead = useMutation({
		mutationFn: ({ ids, read }: { ids: string[]; read: boolean }) =>
			setNotificationsRead(ids, read),
		onMutate: async ({ ids, read }) => {
			const previous = await snapshot()
			const now = new Date().toISOString()
			applyOptimistic((item) =>
				ids.includes(item.id)
					? { ...item, readAt: read ? (item.readAt ?? now) : null }
					: item
			)
			return previous
		},
		onError: (_error, _variables, previous) => {
			rollback(previous)
			toast.error('Não foi possível actualizar a notificação.')
		},
		onSettled: settle,
	})
	const markAllRead = useMutation({
		mutationFn: markAllNotificationsRead,
		onMutate: async () => {
			const previous = await snapshot()
			const now = new Date().toISOString()
			queryClient.setQueryData<FeedData>(FEED_KEY, (data) =>
				data
					? {
							...data,
							pages: data.pages.map((page) => ({
								...page,
								unreadCount: 0,
								notifications: page.notifications.map((item) =>
									item.readAt
										? item
										: { ...item, readAt: now }
								),
							})),
						}
					: data
			)
			return previous
		},
		onSuccess: () => toast.success('Tudo marcado como lido.'),
		onError: (_error, _variables, previous) => {
			rollback(previous)
			toast.error('Não foi possível marcar todas como lidas.')
		},
		onSettled: settle,
	})
	const remove = useMutation({
		mutationFn: (notification: Notification) =>
			deleteNotifications([notification.id]),
		onMutate: async (notification) => {
			const previous = await snapshot()
			applyOptimistic((item) =>
				item.id === notification.id ? null : item
			)
			return previous
		},
		onSuccess: (_data, notification) => {
			toast.success('Notificação removida.', {
				action: {
					label: 'Desfazer',
					onClick: () => restore.mutate(notification),
				},
			})
		},
		onError: (_error, _variables, previous) => {
			rollback(previous)
			toast.error('Não foi possível remover a notificação.')
		},
		onSettled: settle,
	})
	const items = useMemo(
		() => query.data?.pages.flatMap((page) => page.notifications) ?? [],
		[query.data]
	)
	const unreadCount = query.data?.pages[0]?.unreadCount ?? 0
	const unreadCounts = useMemo(() => {
		const counts: Partial<Record<NotificationFilter, number>> = {}
		let loadedUnread = 0
		for (const item of items) {
			if (item.readAt) continue
			loadedUnread += 1
			counts[item.type] = (counts[item.type] ?? 0) + 1
		}
		counts.all = unreadCount
		counts.unread = loadedUnread
		return counts
	}, [items, unreadCount])
	const availableTypes = useMemo(() => {
		const present = new Set<NotificationType>(
			items.map((item) => item.type)
		)
		return NOTIFICATION_TYPE_ORDER.filter((type) => present.has(type))
	}, [items])
	const filtered = useMemo(() => {
		if (filter === 'all') return items
		if (filter === 'unread') return items.filter((item) => !item.readAt)
		return items.filter((item) => item.type === filter)
	}, [items, filter])
	const groups = useMemo(() => groupByDate(filtered), [filtered])
	const isFilterEmpty = items.length > 0 && filtered.length === 0
	return {
		filter,
		setFilter,
		items,
		groups,
		filtered,
		availableTypes,
		unreadCount,
		unreadCounts,
		isFilterEmpty,
		isAuthenticated,
		isLoadingSession,
		isLoading: query.isLoading,
		isError: query.isError,
		isFetching: query.isFetching,
		refetch: query.refetch,
		hasNextPage: Boolean(query.hasNextPage),
		isFetchingNextPage: query.isFetchingNextPage,
		fetchNextPage: query.fetchNextPage,
		setRead,
		markAllRead,
		remove,
	}
}
