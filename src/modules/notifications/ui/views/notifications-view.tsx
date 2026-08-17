'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notifications'
import { useNotificationsFeed } from '../../hooks/use-notifications-feed'
import { NotificationsFilterBar } from '../components/notification-filter-bar'
import { NotificationsAside } from '../components/notifications-aside'
import {
	NotificationsError,
	NotificationsLoading,
	NotificationsSignedOut,
} from '../sections/notifications-gates'
import { NotificationsHeader } from '../sections/notifications-header'
import { NotificationsListSection } from '../sections/notifications-list-section'
export function NotificationsView() {
	const feed = useNotificationsFeed()
	const openNotification = (notification: Notification) => {
		if (notification.readAt) return
		feed.setRead.mutate({ ids: [notification.id], read: true })
	}
	const toggleRead = (notification: Notification) => {
		feed.setRead.mutate({
			ids: [notification.id],
			read: !notification.readAt,
		})
	}
	const isLoading = feed.isLoadingSession || feed.isLoading
	const isReady = feed.isAuthenticated && !isLoading && !feed.isError
	const hasItems = isReady && feed.items.length > 0
	const isSingleCard = !isLoading && !hasItems
	return (
		<>
			<div className='sticky top-0 z-30 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80'>
				<div className='w-full max-w-7xl px-4 pt-5 pb-3 md:px-6 md:pt-7'>
					<NotificationsHeader
						unreadCount={feed.unreadCount}
						isReady={isReady}
						isMarkingAll={feed.markAllRead.isPending}
						onMarkAllRead={() => feed.markAllRead.mutate()}
						isFetching={feed.isFetching}
						onRefresh={() => void feed.refetch()}
					/>

					{isLoading ? (
						<div className='mt-3 flex gap-2' aria-hidden>
							{['todas', 'nao-lidas', 'pedidos'].map((chip) => (
								<Skeleton
									key={chip}
									className='h-11 w-28 rounded-full'
								/>
							))}
						</div>
					) : null}

					{hasItems ? (
						<div className='mt-3'>
							<NotificationsFilterBar
								value={feed.filter}
								onChange={feed.setFilter}
								availableTypes={feed.availableTypes}
								unreadCounts={feed.unreadCounts}
							/>
						</div>
					) : null}
				</div>
			</div>

			<div className='mx-auto flex w-full max-w-7xl items-start gap-8 px-4 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:pt-6'>
				<div
					className={cn(
						'min-w-0 flex-1',
						isSingleCard && 'mx-auto max-w-2xl'
					)}
				>
					{isLoading ? (
						<NotificationsLoading />
					) : !feed.isAuthenticated ? (
						<NotificationsSignedOut />
					) : feed.isError ? (
						<NotificationsError
							isFetching={feed.isFetching}
							onRetry={() => void feed.refetch()}
						/>
					) : (
						<NotificationsListSection
							groups={feed.groups}
							total={feed.filtered.length}
							isEmptyAll={feed.items.length === 0}
							isFilterEmpty={feed.isFilterEmpty}
							onClearFilter={() => feed.setFilter('all')}
							onOpen={openNotification}
							onToggleRead={toggleRead}
							onRemove={(notification) =>
								feed.remove.mutate(notification)
							}
							hasNextPage={feed.hasNextPage}
							isFetchingNextPage={feed.isFetchingNextPage}
							onLoadMore={() => void feed.fetchNextPage()}
						/>
					)}
				</div>

				{isLoading || hasItems ? (
					<NotificationsAside
						filter={feed.filter}
						unreadCounts={feed.unreadCounts}
						onFilterChange={feed.setFilter}
					/>
				) : null}
			</div>
		</>
	)
}
