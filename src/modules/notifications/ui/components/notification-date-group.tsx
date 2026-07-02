import type { Notification } from '@/types/notifications'
import { NotificationCard } from './notification-card'

type NotificationsDateGroupProps = {
	label: string
	notifications: Notification[]
	onMarkRead: (id: string) => void
}

export const NotificationsDateGroup = ({
	label,
	notifications,
	onMarkRead,
}: NotificationsDateGroupProps) => (
	<div className='space-y-2'>
		<div className='flex items-center gap-3 px-1'>
			<span className='text-xs font-bold uppercase tracking-widest text-muted-foreground/50'>
				{label}
			</span>
			<div className='h-px flex-1 bg-border/40' />
		</div>

		<div className='overflow-hidden rounded-2xl border border-border/60 shadow-sm'>
			{notifications.map((n, i) => (
				<div
					key={n.id}
					className={
						i < notifications.length - 1
							? 'border-b border-border/40'
							: ''
					}
				>
					<NotificationCard
						notification={n}
						onMarkRead={onMarkRead}
					/>
				</div>
			))}
		</div>
	</div>
)
