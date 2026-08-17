import type { Notification } from '@/types/notifications'
import { NotificationCard } from './notification-card'

type NotificationsDateGroupProps = {
	label: string
	notifications: Notification[]
	onOpen: (notification: Notification) => void
	onToggleRead: (notification: Notification) => void
	onRemove: (notification: Notification) => void
}
export const NotificationsDateGroup = ({
	label,
	notifications,
	onOpen,
	onToggleRead,
	onRemove,
}: NotificationsDateGroupProps) => {
	const headingId = `notificacoes-${label.toLowerCase().replace(/\s+/g, '-')}`
	return (
		<section className='space-y-2' aria-labelledby={headingId}>
			<div className='flex items-center gap-3 px-1'>
				<h2
					id={headingId}
					className='text-xs font-bold uppercase tracking-widest text-muted-foreground/60'
				>
					{label}
				</h2>
				<div className='h-px flex-1 bg-border/40' aria-hidden />
			</div>

			<ul className='divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/60 shadow-sm'>
				{notifications.map((notification) => (
					<li key={notification.id} className='scroll-mt-[11rem]'>
						<NotificationCard
							notification={notification}
							onOpen={onOpen}
							onToggleRead={onToggleRead}
							onRemove={onRemove}
						/>
					</li>
				))}
			</ul>
		</section>
	)
}
