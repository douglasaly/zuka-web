import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'
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

	const dimension = size === 'md' ? 'size-10' : 'size-9'
	const iconDimension = size === 'md' ? 'size-5' : 'size-4'
	const badgeDimension = size === 'md' ? 'size-4.5' : 'size-4'
	const badgeIconDimension = size === 'md' ? 'size-3' : 'size-2.5'

	if (!sender) {
		// Notificação da plataforma (system/promotion) — mantém o ícone grande
		return (
			<div
				className={cn(
					'flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105',
					dimension,
					meta.bg
				)}
			>
				<Icon className={cn(iconDimension, meta.fg)} />
			</div>
		)
	}

	const initials = sender.name
		.split(' ')
		.map((w) => w[0])
		.slice(0, 2)
		.join('')
		.toUpperCase()

	return (
		<div className='relative shrink-0'>
			{sender.avatarUrl ? (
				// biome-ignore lint/performance/noImgElement: <NoIMGElement>
				<img
					src={sender.avatarUrl}
					alt={sender.name}
					className={cn(
						dimension,
						'object-cover transition-transform duration-200 group-hover:scale-105',
						sender.type === 'store' ? 'rounded-lg' : 'rounded-full'
					)}
				/>
			) : (
				<div
					className={cn(
						dimension,
						'flex items-center justify-center bg-muted text-sm font-bold text-muted-foreground',
						sender.type === 'store' ? 'rounded-lg' : 'rounded-full'
					)}
				>
					{initials}
				</div>
			)}

			<div
				className={cn(
					'absolute -bottom-1 -right-1 flex items-center justify-center rounded-full ring-2 ring-background',
					badgeDimension,
					meta.bg
				)}
			>
				<Icon className={cn(badgeIconDimension, meta.fg)} />
			</div>
		</div>
	)
}
