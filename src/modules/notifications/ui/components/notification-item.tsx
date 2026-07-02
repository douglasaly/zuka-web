'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'
import { NOTIFICATION_META } from '../../constants'

interface NotificationItemProps {
	notification: Notification
	onClick?: () => void
	variant?: 'dropdown' | 'full'
	className?: string
}

export function NotificationItem({
	notification,
	onClick,
	variant = 'dropdown',
	className,
}: NotificationItemProps) {
	const isUnread = !notification.readAt
	const meta = NOTIFICATION_META[notification.type]
	const Icon = meta.icon

	const content = (
		<div
			className={cn(
				'flex items-start gap-3',
				variant === 'dropdown' ? 'px-4 py-3' : 'px-5 py-4'
			)}
		>
			<div
				className={cn(
					'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
					meta.bg
				)}
			>
				<Icon className={cn('size-4', meta.fg)} />
			</div>

			<div className='min-w-0 flex-1'>
				<div className='flex items-start justify-between gap-2'>
					<p
						className={cn(
							'text-sm leading-snug',
							isUnread
								? 'font-semibold text-foreground'
								: 'font-medium text-muted-foreground'
						)}
					>
						{notification.title}
					</p>
					{isUnread && (
						<span className='mt-1 size-2 shrink-0 rounded-full bg-secondary' />
					)}
				</div>

				<p className='mt-0.5 line-clamp-2 text-xs text-muted-foreground'>
					{notification.body}
				</p>

				<div className='mt-1.5 flex items-center gap-2'>
					<span
						className={cn(
							'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
							meta.bg,
							meta.fg
						)}
					>
						{meta.label}
					</span>
					<span className='text-[10px] text-muted-foreground/60'>
						{format(
							new Date(notification.createdAt),
							"d MMM 'às' HH:mm",
							{ locale: pt }
						)}
					</span>
				</div>
			</div>
		</div>
	)

	const baseClass = cn(
		'w-full text-left transition-colors hover:bg-muted/50',
		isUnread && 'bg-primary/5',
		className
	)

	if (notification.link) {
		return (
			<Link
				href={notification.link}
				onClick={onClick}
				className={cn(baseClass, 'block')}
			>
				{content}
			</Link>
		)
	}

	return (
		<button type='button' onClick={onClick} className={baseClass}>
			{content}
		</button>
	)
}
