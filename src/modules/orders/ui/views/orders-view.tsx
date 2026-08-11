'use client'

import { useOrders } from '../../hooks/use-orders'
import { OrdersAside } from '../components/orders-aside'
import { OrdersToolbar } from '../components/orders-toolbar'
import { OrdersError, OrdersLoading } from '../sections/orders-gates'
import { OrdersHeader } from '../sections/orders-header'
import { OrdersListSection } from '../sections/orders-list-section'

export const OrdersView = () => {
	const o = useOrders()

	return (
		<div className='mx-auto w-full max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:py-8'>
			<OrdersHeader />

			<div className='mb-5 sm:mb-6'>
				<OrdersToolbar
					search={o.search}
					onSearchChange={o.setSearch}
					status={o.status}
					onStatusChange={o.setStatus}
					statusCounts={o.statusCounts}
					showCounts={
						!o.isLoading && !o.isError && o.statusCounts.all > 0
					}
					period={o.period}
					onPeriodChange={o.setPeriod}
					store={o.store}
					onStoreChange={o.setStore}
					stores={o.stores}
				/>
			</div>

			{o.isLoading ? (
				<OrdersLoading />
			) : o.isError ? (
				<OrdersError
					isFetching={o.isFetching}
					onRetry={() => o.refetch()}
				/>
			) : (
				<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
					<div className='order-2 min-w-0 flex-1 lg:order-1'>
						<OrdersListSection
							isEmptyAll={o.isEmptyAll}
							filtered={o.filtered}
							hasFilters={o.hasFilters}
							onClearFilters={o.clearFilters}
							hasNextPage={Boolean(o.hasNextPage)}
							isFetchingNextPage={o.isFetchingNextPage}
							onLoadMore={() => void o.fetchNextPage()}
						/>
					</div>

					{o.showAside ? (
						<OrdersAside
							className='order-1 lg:order-2'
							pendingReviews={o.pendingReviews}
							pendingReviewCount={o.pendingReviewCount}
							recentOrder={o.recentOrder}
							statusCounts={o.statusCounts}
							onStatusChange={o.setStatus}
						/>
					) : null}
				</div>
			)}
		</div>
	)
}
