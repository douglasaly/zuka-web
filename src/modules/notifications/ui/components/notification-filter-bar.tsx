'use client'
import type { LucideIcon } from 'lucide-react'
import { Bell, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types'
import {
	NOTIFICATION_META,
	NOTIFICATION_TYPE_ORDER,
	type NotificationFilter,
} from '../../constants'

type FilterChip = {
	value: NotificationFilter
	label: string
	icon: LucideIcon
}
type NotificationsFilterBarProps = {
	value: NotificationFilter
	onChange: (value: NotificationFilter) => void
	availableTypes: NotificationType[]
	unreadCounts: Partial<Record<NotificationFilter, number>>
}
export const NotificationsFilterBar = ({
	value,
	onChange,
	availableTypes,
	unreadCounts,
}: NotificationsFilterBarProps) => {
	const showUnread = (unreadCounts.unread ?? 0) > 0 || value === 'unread'
	const types = NOTIFICATION_TYPE_ORDER.filter(
		(type) => availableTypes.includes(type) || type === value
	)
	const chips: FilterChip[] = [
		{ value: 'all', label: 'Todas', icon: Inbox },
		...(showUnread
			? [
					{
						value: 'unread' as NotificationFilter,
						label: 'Não lidas',
						icon: Bell,
					},
				]
			: []),
		...types.map((type) => ({
			value: type,
			label: NOTIFICATION_META[type].plural,
			icon: NOTIFICATION_META[type].icon,
		})),
	]
	return (
		<fieldset className='flex min-w-0 gap-2 overflow-x-auto scrollbar-hide xl:px-18'>
			<legend className='sr-only'>Filtrar notificações</legend>
			{chips.map((chip) => {
				const isActive = value === chip.value
				const count =
					chip.value === 'all' ? 0 : (unreadCounts[chip.value] ?? 0)
				return (
					<button
						key={chip.value}
						type='button'
						aria-pressed={isActive}
						onClick={() => onChange(chip.value)}
						className={cn(
							'flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
							isActive
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
						)}
					>
						<chip.icon className='size-4' aria-hidden />
						{chip.label}
						{count > 0 ? (
							<span
								className={cn(
									'min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none',
									isActive
										? 'bg-primary-foreground/20 text-primary-foreground'
										: 'bg-secondary/12 text-secondary'
								)}
							>
								{count > 99 ? '99+' : count}
								<span className='sr-only'> não lidas</span>
							</span>
						) : null}
					</button>
				)
			})}
		</fieldset>
	)
}
