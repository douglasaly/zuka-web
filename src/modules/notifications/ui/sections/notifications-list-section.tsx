'use client'
import { Button } from '@/components/ui/button'
import type { Notification } from '@/types/notifications'
import { NotificationsDateGroup } from '../components/notification-date-group'
import {
	NotificationsEmptyAll,
	NotificationsEmptyFiltered,
} from './notifications-gates'

type NotificationsListSectionProps = {
	groups: [string, Notification[]][]
	total: number
	isEmptyAll: boolean
	isFilterEmpty: boolean
	onClearFilter: () => void
	onOpen: (notification: Notification) => void
	onToggleRead: (notification: Notification) => void
	onRemove: (notification: Notification) => void
	hasNextPage: boolean
	isFetchingNextPage: boolean
	onLoadMore: () => void
}
export function NotificationsListSection({
	groups,
	total,
	isEmptyAll,
	isFilterEmpty,
	onClearFilter,
	onOpen,
	onToggleRead,
	onRemove,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
}: NotificationsListSectionProps) {
	if (isEmptyAll) return <NotificationsEmptyAll />
	if (isFilterEmpty) {
		return <NotificationsEmptyFiltered onClear={onClearFilter} />
	}
	return (
		<div className='space-y-6'>
			<p className='text-sm text-muted-foreground' aria-live='polite'>
				{total} {total === 1 ? 'notificação' : 'notificações'}
			</p>

			{groups.map(([label, items]) => (
				<NotificationsDateGroup
					key={label}
					label={label}
					notifications={items}
					onOpen={onOpen}
					onToggleRead={onToggleRead}
					onRemove={onRemove}
				/>
			))}

			{hasNextPage ? (
				<div className='flex justify-center pt-1'>
					<Button
						variant='ghost'
						size='sm'
						className='min-h-11 rounded-full text-sm text-secondary hover:text-secondary/80'
						disabled={isFetchingNextPage}
						onClick={onLoadMore}
					>
						{isFetchingNextPage
							? 'A carregar notificações…'
							: 'Carregar mais notificações'}
					</Button>
				</div>
			) : null}
		</div>
	)
}
