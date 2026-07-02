'use client'

import { Bell } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useNotifications } from '@/hooks/use-notifications'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'
import { NotificationItem } from './notification-item'
import { NotificationsSkeleton } from './notifications-skeleton'

export function NotificationDropdown() {
	const { isAuthenticated, isLoading: authLoading } = useUserProfile()
	const {
		isLoading: isNotificationsLoading,
		markRead,
		notifications: notificationRaw,
		unreadCount,
	} = useNotifications()

	const notifications: Notification[] = notificationRaw

	const handleMarkAllRead = () => {
		const unreadIds = notifications
			.filter((n) => !n.readAt)
			.map((n) => n.id)
		if (unreadIds.length > 0) markRead.mutate(unreadIds)
	}

	if (authLoading || !isAuthenticated) return null

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant='ghost'
						size='icon-sm'
						type='button'
						aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
						className='relative'
					>
						<Bell className='size-4' />
						{unreadCount > 0 && (
							<span className='absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background'>
								{unreadCount > 9 ? '9+' : unreadCount}
							</span>
						)}
					</Button>
				}
			/>

			<PopoverContent
				align='end'
				sideOffset={8}
				className='w-95 p-0 shadow-lg'
			>
				{/* HEADER */}
				<div className='flex items-center justify-between border-b border-border/60 px-4 py-3.5'>
					<div className='flex items-center gap-2'>
						<span className='font-semibold'>Notificações</span>
						{unreadCount > 0 && (
							<span className='rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold text-white'>
								{unreadCount}
							</span>
						)}
					</div>

					{unreadCount > 0 && (
						<Button
							variant='ghost'
							size='sm'
							disabled={markRead.isPending}
							onClick={handleMarkAllRead}
							className='h-auto px-2 py-1 text-xs text-secondary hover:text-secondary/80'
						>
							Marcar todas como lidas
						</Button>
					)}
				</div>

				{/* LISTA */}
				<div className='max-h-105 overflow-y-auto'>
					{isNotificationsLoading ? (
						<NotificationsSkeleton />
					) : notifications.length === 0 ? (
						<div className='flex flex-col items-center justify-center gap-2 py-14'>
							<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
								<Bell className='size-5 text-muted-foreground/60' />
							</div>
							<p className='text-sm font-medium'>Tudo em dia</p>
							<p className='text-xs text-muted-foreground'>
								Não tem notificações por ler
							</p>
						</div>
					) : (
						<div className='py-1'>
							{notifications.map((n) => (
								<NotificationItem
									key={n.id}
									notification={n}
									variant='dropdown'
									onClick={() => markRead.mutate([n.id])}
									className={cn(!n.readAt && 'bg-muted/40')}
								/>
							))}
						</div>
					)}
				</div>

				{/* FOOTER */}
				{!isNotificationsLoading && (
					<div className='border-t border-border/60 p-2'>
						<Button
							variant='ghost'
							className='w-full justify-center text-sm font-medium text-secondary hover:text-secondary/80'
							render={<Link href='/notificacoes' />}
						>
							Ver todas as notificações
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}
