'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/use-notifications'
import { getNotifications } from '@/lib/api/notifications'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import type { Notification, NotificationType } from '@/types/notifications'
import { groupByDate } from '@/utils/group-by-date'
import { NotificationsDateGroup } from '../components/notification-date-group'
import {
	type NotificationFilter,
	NotificationsFilterBar,
} from '../components/notification-filter-bar'
import { NotificationsPageSkeleton } from '../components/notification-page-skeleton'

export function NotificationsView() {
	const router = useRouter()
	const [filter, setFilter] = useState<NotificationFilter>('all')
	const { markRead } = useNotifications()

	const { data, isLoading } = useQuery({
		queryKey: ['notifications', 'all'],
		queryFn: () => getNotifications(20),
	})

	const notifications: Notification[] = data?.notifications ?? []
	const unread = notifications.filter((n) => !n.readAt)

	const unreadCounts = useMemo(() => {
		const counts: Partial<Record<NotificationFilter, number>> = {
			all: unread.length,
		}
		for (const n of unread) {
			counts[n.type as NotificationType] =
				(counts[n.type as NotificationType] ?? 0) + 1
		}
		return counts
	}, [unread])

	const filtered = useMemo(
		() =>
			filter === 'all'
				? notifications
				: notifications.filter((n) => n.type === filter),
		[notifications, filter]
	)

	const groups = useMemo(() => groupByDate(filtered), [filtered])

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			{/* HEADER */}
			<div className='mb-8 flex items-start justify-between gap-4'>
				<div className='flex gap-1 items-start'>
					<Button variant='ghost' onClick={() => router.back()}>
						<ArrowLeft className='size-4' />
					</Button>

					<div>
						<h1 className='font-heading text-2xl font-bold md:text-3xl'>
							Notificações
						</h1>
						{!isLoading && (
							<p className='mt-1 text-sm text-muted-foreground'>
								{unread.length > 0
									? `${unread.length} não ${unread.length === 1 ? 'lida' : 'lidas'}`
									: 'Tudo em dia'}
							</p>
						)}
					</div>
				</div>

				{unread.length > 0 && (
					<Button
						variant='outline'
						size='sm'
						className='shrink-0 gap-1.5'
						onClick={() => markRead.mutate(unread.map((n) => n.id))}
						disabled={markRead.isPending}
					>
						<CheckCheck className='size-4' />
						Marcar todas como lidas
					</Button>
				)}
			</div>

			{/* FILTROS */}
			{!isLoading && notifications.length > 0 && (
				<div className='mb-6'>
					<NotificationsFilterBar
						value={filter}
						onChange={setFilter}
						unreadCounts={unreadCounts}
					/>
				</div>
			)}

			{/* CONTEÚDO */}
			{isLoading ? (
				<NotificationsPageSkeleton />
			) : notifications.length === 0 ? (
				<EmptyState
					icon={Bell}
					title='Tudo em dia'
					description='Não tem notificações de momento'
				/>
			) : filtered.length === 0 ? (
				<EmptyState
					icon={Bell}
					title='Sem notificações nesta categoria'
					description='Selecione outro filtro para ver mais'
				/>
			) : (
				<div className='space-y-8'>
					{groups.map(([label, items]) => (
						<NotificationsDateGroup
							key={label}
							label={label}
							notifications={items}
							onMarkRead={(id) => markRead.mutate([id])}
						/>
					))}
				</div>
			)}
		</div>
	)
}
