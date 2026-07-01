'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCheck, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NotificationItem } from '../components/notification-item'
import type { Notification } from '@/types/notifications'

export function NotificationsView() {
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['notifications', 'all'],
		queryFn: async () => {
			const res = await fetch('/api/notifications?limit=50', {
				credentials: 'include',
			})
			if (!res.ok) throw new Error('Failed to fetch')
			return res.json()
		},
	})

	const markRead = useMutation({
		mutationFn: async (ids: string[]) => {
			const res = await fetch('/api/notifications', {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ids }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['notifications'] })
		},
	})

	const notifications: Notification[] = data?.notifications ?? []
	const unread = notifications.filter((n) => !n.readAt)

	const handleMarkAllRead = () => {
		const ids = unread.map((n) => n.id)
		if (ids.length > 0) markRead.mutate(ids)
	}

	return (
		<div className='mx-auto max-w-2xl px-4 py-8'>
			<div className='mb-6 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<Bell className='size-6' />
					<h1 className='text-2xl font-bold font-heading'>
						Notificações
					</h1>
				</div>
				{unread.length > 0 && (
					<Button
						variant='outline'
						size='sm'
						onClick={handleMarkAllRead}
						disabled={markRead.isPending}
					>
						<CheckCheck className='mr-1.5 size-4' />
						Marcar todas como lidas
					</Button>
				)}
			</div>

			{isLoading ? (
				<div className='space-y-4'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className='flex items-start gap-3 rounded-2xl border border-border/60 p-4'
						>
							<Skeleton className='mt-1.5 size-2 rounded-full' />
							<div className='flex-1 space-y-2'>
								<Skeleton className='h-5 w-2/3' />
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-3 w-1/4' />
							</div>
						</div>
					))}
				</div>
			) : notifications.length === 0 ? (
				<div className='rounded-2xl border border-border/60 py-16 text-center'>
					<Bell className='mx-auto mb-3 size-8 text-muted-foreground/40' />
					<p className='text-sm text-muted-foreground'>
						Nenhuma notificação ainda.
					</p>
				</div>
			) : (
				<div className='divide-y divide-border/40 rounded-2xl border border-border/60 overflow-hidden'>
					{notifications.map((n) => (
						<NotificationItem
							key={n.id}
							notification={n}
							variant='full'
							onClick={() => {
								if (!n.readAt) markRead.mutate([n.id])
							}}
						/>
					))}
				</div>
			)}
		</div>
	)
}
