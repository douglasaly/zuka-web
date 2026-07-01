'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NotificationItem } from './notification-item'
import { useUserProfile } from '@/hooks/use-user-profile'

export function NotificationDropdown() {
	const { isAuthenticated, isLoading: authLoading } = useUserProfile()
	const qc = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['notifications', 'recent'],
		queryFn: async () => {
			const res = await fetch('/api/notifications?limit=5', {
				credentials: 'include',
			})
			if (!res.ok) throw new Error('Failed to fetch')
			return res.json()
		},
		enabled: isAuthenticated,
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

	const notifications = data?.notifications ?? []
	const unreadCount: number = data?.unreadCount ?? 0

	const handleMarkRead = (id: string) => {
		markRead.mutate([id])
	}

	if (authLoading || !isAuthenticated) return null

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					size='icon-sm'
					type='button'
					aria-label='Notificações'
				>
					<div className='relative'>
						<Bell className='size-4' />
						{unreadCount > 0 && (
							<span className='absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground'>
								{unreadCount > 9 ? '9+' : unreadCount}
							</span>
						)}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent align='end' sideOffset={8} className='w-80 p-0'>
				<div className='flex items-center justify-between border-b border-border/60 px-4 py-3'>
					<span className='text-sm font-semibold'>Notificações</span>
					{notifications.length > 0 && (
						<Button
							variant='ghost'
							size='sm'
							className='h-auto px-2 py-1 text-xs text-muted-foreground'
							onClick={() => {
								const unreadIds = notifications
									.filter(
										(n: { readAt: string | null }) =>
											!n.readAt
									)
									.map((n: { id: string }) => n.id)
								if (unreadIds.length > 0)
									markRead.mutate(unreadIds)
							}}
						>
							Marcar todas como lidas
						</Button>
					)}
				</div>

				<div className='max-h-80 overflow-y-auto'>
					{isLoading ? (
						<div className='space-y-3 p-4'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='flex items-start gap-3'>
									<Skeleton className='mt-1.5 size-2 rounded-full' />
									<div className='flex-1 space-y-2'>
										<Skeleton className='h-4 w-3/4' />
										<Skeleton className='h-3 w-full' />
									</div>
								</div>
							))}
						</div>
					) : notifications.length === 0 ? (
						<div className='py-12 text-center text-sm text-muted-foreground'>
							Nenhuma notificação
						</div>
					) : (
						notifications.map((n: { id: string }) => (
							<NotificationItem
								key={n.id}
								notification={n}
								variant='dropdown'
								onClick={() => handleMarkRead(n.id)}
							/>
						))
					)}
				</div>

				<div className='border-t border-border/60 p-2'>
					<Button
						variant='ghost'
						className='w-full justify-center text-sm font-medium'
						render={<Link href='/notificacoes' />}
					>
						Ver mais
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
