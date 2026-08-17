'use client'
import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ArrowRight, Check, Mail, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'
import { formatLongPtDateTime } from '@/utils/format-date'
import { NOTIFICATION_META, NOTIFICATION_UNREAD_SURFACE } from '../../constants'
import { NotificationAvatar } from './notification-avatar'

type NotificationCardProps = {
	notification: Notification
	onOpen: (notification: Notification) => void
	onToggleRead: (notification: Notification) => void
	onRemove: (notification: Notification) => void
}
export const NotificationCard = ({
	notification,
	onOpen,
	onToggleRead,
	onRemove,
}: NotificationCardProps) => {
	const isUnread = !notification.readAt
	const meta = NOTIFICATION_META[notification.type]
	const Icon = meta.icon
	const sender = notification.sender
	const { link } = notification
	const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
		locale: pt,
	})
	const summary = (
		<div className='flex items-start gap-3'>
			<NotificationAvatar notification={notification} size='md' />

			<div className='min-w-0 flex-1'>
				<div className='flex items-start gap-2'>
					<p
						className={cn(
							'max-w-prose text-sm leading-snug',
							isUnread
								? 'font-semibold text-foreground'
								: 'font-medium text-muted-foreground'
						)}
					>
						{sender ? (
							<>
								<span className='font-bold text-foreground'>
									{sender.name}
								</span>
								{', '}
							</>
						) : null}
						{notification.title}
					</p>

					{isUnread ? (
						<>
							<span
								className='mt-1.5 size-2 shrink-0 rounded-full bg-secondary'
								aria-hidden
							/>
							<span className='sr-only'>Não lida</span>
						</>
					) : null}
				</div>

				<p className='mt-1 line-clamp-2 max-w-prose text-sm text-muted-foreground'>
					{notification.body}
				</p>

				<div className='mt-2 flex flex-wrap items-center gap-x-2 gap-y-1'>
					<span
						className={cn(
							'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
							meta.tint
						)}
					>
						<Icon className='size-3' aria-hidden />
						{meta.label}
					</span>
					<time
						dateTime={notification.createdAt}
						title={formatLongPtDateTime(notification.createdAt)}
						className='text-[11px] text-muted-foreground'
					>
						{timeAgo}
					</time>
				</div>
			</div>
		</div>
	)
	return (
		<div
			className={cn(
				'group px-4 py-3.5 transition-colors sm:px-5',
				isUnread
					? cn(
							NOTIFICATION_UNREAD_SURFACE,
							'hover:bg-secondary/[0.09] dark:hover:bg-secondary/[0.16]'
						)
					: 'bg-card hover:bg-muted/50'
			)}
		>
			<div className='flex flex-col gap-2.5 xl:flex-row xl:items-center xl:gap-6'>
				{link ? (
					<Link
						href={link}
						onClick={() => onOpen(notification)}
						className='block min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring xl:flex-1'
					>
						{summary}
					</Link>
				) : (
					<div className='min-w-0 xl:flex-1'>{summary}</div>
				)}

				<div className='flex items-center gap-1 pl-13 xl:shrink-0 xl:pl-0'>
					{link ? (
						<Button
							variant='outline'
							size='sm'
							className='min-h-9 rounded-full text-xs'
							render={
								<Link
									href={link}
									onClick={() => onOpen(notification)}
								/>
							}
						>
							{meta.action}
							<ArrowRight className='size-3.5' aria-hidden />
						</Button>
					) : null}

					<div className='ml-auto flex items-center gap-1'>
						<IconTooltipButton
							size='icon'
							label={
								isUnread
									? 'Marcar como lida'
									: 'Marcar como não lida'
							}
							aria-pressed={!isUnread}
							onClick={() => onToggleRead(notification)}
						>
							{isUnread ? (
								<Check className='size-4' />
							) : (
								<Mail className='size-4' />
							)}
						</IconTooltipButton>

						<IconTooltipButton
							size='icon'
							label='Remover notificação'
							className='text-muted-foreground hover:text-destructive'
							onClick={() => onRemove(notification)}
						>
							<Trash2 className='size-4' />
						</IconTooltipButton>
					</div>
				</div>
			</div>
		</div>
	)
}
