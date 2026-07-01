'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'

interface NotificationItemProps {
	notification: Notification
	onClick?: () => void
	variant?: 'dropdown' | 'full'
}

export function NotificationItem({
	notification,
	onClick,
	variant = 'dropdown',
}: NotificationItemProps) {
	const isUnread = !notification.readAt

	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(
				'w-full text-left transition-colors hover:bg-muted/50',
				isUnread && 'bg-primary/5',
				variant === 'dropdown' ? 'px-4 py-3' : 'px-5 py-4'
			)}
		>
			<div className='flex items-start gap-3'>
				<div
					className={cn(
						'mt-1.5 size-2 shrink-0 rounded-full',
						isUnread ? 'bg-primary' : 'bg-transparent'
					)}
				/>
				<div className='min-w-0 flex-1'>
					<p
						className={cn(
							'text-sm',
							isUnread
								? 'font-semibold'
								: 'font-medium text-muted-foreground'
						)}
					>
						{notification.title}
					</p>
					<p className='mt-0.5 text-xs text-muted-foreground line-clamp-2'>
						{notification.body}
					</p>
					<p className='mt-1 text-xs text-muted-foreground/60'>
						{format(
							new Date(notification.createdAt),
							"d MMM 'às' HH:mm",
							{
								locale: pt,
							}
						)}
					</p>
				</div>
			</div>
		</button>
	)
}
