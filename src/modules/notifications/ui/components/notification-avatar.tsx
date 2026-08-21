import { StoreAvatar } from '@/components/store-avatar'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'
import { NOTIFICATION_META } from '../../constants'

type NotificationAvatarProps = {
	notification: Notification
	size?: 'sm' | 'md'
}
export function NotificationAvatar({
	notification,
	size = 'sm',
}: NotificationAvatarProps) {
	const meta = NOTIFICATION_META[notification.type]
	const Icon = meta.icon
	const sender = notification.sender
	const isMd = size === 'md'
	const dimension = isMd ? 'size-10' : 'size-9'
	if (!sender) {
		return (
			<div
				className={cn(
					'flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105',
					dimension,
					meta.tint
				)}
			>
				<Icon className={isMd ? 'size-5' : 'size-4'} aria-hidden />
			</div>
		)
	}
	const avatarProps = {
		imageUrl: sender.avatarUrl,
		name: sender.name,
		size: isMd ? ('lg' as const) : ('default' as const),
		className: 'transition-transform duration-200 group-hover:scale-105',
		fClassName: isMd ? 'text-sm font-bold' : 'text-xs font-bold',
	}
	return (
		<div className='relative shrink-0'>
			{sender.type === 'store' ? (
				<StoreAvatar {...avatarProps} />
			) : (
				<UserAvatar {...avatarProps} />
			)}

			<span
				className={cn(
					'absolute -right-1 -bottom-1 z-10 flex items-center justify-center rounded-full ring-2 ring-background',
					isMd ? 'size-4.5' : 'size-4',
					meta.tint
				)}
			>
				<Icon
					className={cn('shrink-0', isMd ? 'size-3' : 'size-2.5')}
					aria-hidden
				/>
			</span>
		</div>
	)
}
