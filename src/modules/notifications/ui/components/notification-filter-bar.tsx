import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types/notifications'
import { NOTIFICATION_META } from '../../constants'

export type NotificationFilter = NotificationType | 'all'

const FILTERS: { value: NotificationFilter; label: string }[] = [
	{ value: 'all', label: 'Todas' },
	{ value: 'message', label: 'Mensagens' },
	{ value: 'order', label: 'Pedidos' },
	{ value: 'offer', label: 'Ofertas' },
	{ value: 'follow', label: 'Seguidores' },
	{ value: 'review', label: 'Avaliações' },
	{ value: 'promotion', label: 'Promoções' },
	{ value: 'system', label: 'Sistema' },
]

type NotificationsFilterBarProps = {
	value: NotificationFilter
	onChange: (value: NotificationFilter) => void
	unreadCounts: Partial<Record<NotificationFilter, number>>
}

export const NotificationsFilterBar = ({
	value,
	onChange,
	unreadCounts,
}: NotificationsFilterBarProps) => (
	<div className='flex gap-2 overflow-x-auto scrollbar-hide'>
		{FILTERS.map((f) => {
			const isActive = value === f.value
			const meta =
				f.value !== 'all'
					? NOTIFICATION_META[f.value as NotificationType]
					: null
			const count = unreadCounts[f.value]

			return (
				<button
					key={f.value}
					type='button'
					onClick={() => onChange(f.value)}
					className={cn(
						'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
						isActive
							? 'border-primary bg-primary text-primary-foreground shadow-sm'
							: 'border-border/60 bg-white text-muted-foreground hover:border-primary/30 hover:text-foreground'
					)}
				>
					{meta && (
						<meta.icon
							className={cn(
								'size-3.5',
								isActive ? 'text-primary-foreground' : meta.fg
							)}
						/>
					)}
					{f.label}
					{count != null && count > 0 && (
						<span
							className={cn(
								'min-w-4.5 rounded-full px-1 py-0.5 text-center text-[10px] font-bold leading-none',
								isActive
									? 'bg-white/20 text-primary-foreground'
									: 'bg-destructive text-white'
							)}
						>
							{count > 9 ? '9+' : count}
						</span>
					)}
				</button>
			)
		})}
	</div>
)
