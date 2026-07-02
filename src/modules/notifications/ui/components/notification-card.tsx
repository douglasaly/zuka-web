'use client'

import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'
import { NOTIFICATION_META } from '../../constants'
import { NotificationAvatar } from './notification-avatar'

type NotificationCardProps = {
	notification: Notification
	onMarkRead: (id: string) => void
}

export const NotificationCard = ({
	notification,
	onMarkRead,
}: NotificationCardProps) => {
	const isUnread = !notification.readAt
	const meta = NOTIFICATION_META[notification.type]
	const Icon = meta.icon
	const sender = notification.sender

	const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
		locale: pt,
	})

	const inner = (
		<div
			className={cn(
				'group flex items-start gap-4 border-l-[3px] bg-white px-5 py-4 transition-colors hover:bg-neutral-50',
				isUnread ? meta.border : 'border-l-transparent'
			)}
		>
			<div className='mt-0.5'>
				<NotificationAvatar notification={notification} size='md' />
			</div>

			<div className='min-w-0 flex-1'>
				<div className='flex items-start justify-between gap-3'>
					<p
						className={cn(
							'text-sm leading-snug',
							isUnread
								? 'font-semibold text-foreground'
								: 'font-medium text-secondary-600'
						)}
					>
						{sender && (
							<>
								<span className='font-bold text-foreground'>
									{sender.name}
								</span>
								{' — '}
							</>
						)}
						{notification.title}
					</p>

					<div className='flex shrink-0 items-center gap-2'>
						<span className='text-[11px] text-muted-foreground'>
							{timeAgo}
						</span>
						{isUnread && (
							<span className='size-2 shrink-0 rounded-full bg-secondary' />
						)}
					</div>
				</div>

				<p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
					{notification.body}
				</p>

				<span
					className={cn(
						'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
						meta.bg,
						meta.fg
					)}
				>
					<Icon className='size-3' />
					{meta.label}
				</span>
			</div>
		</div>
	)

	if (notification.link) {
		return (
			<Link
				href={notification.link}
				onClick={() => {
					if (isUnread) onMarkRead(notification.id)
				}}
				className='block'
			>
				{inner}
			</Link>
		)
	}

	return (
		<button
			type='button'
			className='w-full text-left'
			onClick={() => {
				if (isUnread) onMarkRead(notification.id)
			}}
		>
			{inner}
		</button>
	)
}
