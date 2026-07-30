'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useSellerOrders } from '@/modules/seller/hooks/use-seller-orders'
import { DEFAULT_PER_PAGE } from '@/modules/seller/ui/components/orders/constants'
import { OrderStatusConfirmDialog } from '@/modules/seller/ui/components/orders/order-status-confirm-dialog'
import { OrdersTableSkeleton } from '@/modules/seller/ui/components/orders/orders-table-skeleton'
import { SellerOrderDetailSheetContent } from '@/modules/seller/ui/components/seller-order-detail-sheet'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import {
	SellerOrdersEmptyState,
	SellerOrdersErrorState,
	SellerOrdersFilteredEmpty,
} from '@/modules/seller/ui/sections/seller-orders-empty'
import { SellerOrdersListSection } from '@/modules/seller/ui/sections/seller-orders-list-section'
import { SellerOrdersToolbar } from '@/modules/seller/ui/sections/seller-orders-toolbar'

export const SellerOrdersView = () => {
	useSetSellerPageMeta({
		title: 'Pedidos',
		crumbs: ['Dashboard', 'Pedidos'],
	})

	const {
		searchInput,
		setSearchInput,
		statusFilter,
		dateFilter,
		perPage,
		replaceParams,
		goToPage,
		clearFilters,
		orders,
		totalPages,
		currentPage,
		rangeLabel,
		showPager,
		isEmptyStore,
		isPageFetching,
		isLoading,
		isError,
		hasData,
		refetch,
		selectedId,
		setSelectedId,
		pendingAction,
		setPendingAction,
		statusMutation,
	} = useSellerOrders()

	if (isLoading && !hasData) return <OrdersTableSkeleton />

	if (isError && !hasData) {
		return <SellerOrdersErrorState onRetry={() => refetch()} />
	}

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<p className='max-w-3xl text-sm leading-relaxed text-muted-foreground'>
				Acompanhe e actualize os pedidos da sua loja.
			</p>

			{isEmptyStore ? (
				<SellerOrdersEmptyState />
			) : (
				<>
					<SellerOrdersToolbar
						searchInput={searchInput}
						onSearchChange={setSearchInput}
						statusFilter={statusFilter}
						dateFilter={dateFilter}
						perPage={perPage}
						onStatusChange={(v) =>
							replaceParams({ status: v }, { resetPage: true })
						}
						onDateChange={(v) =>
							replaceParams({ date: v }, { resetPage: true })
						}
						onPerPageChange={(v) =>
							replaceParams(
								{
									perPage:
										v === String(DEFAULT_PER_PAGE)
											? null
											: v,
								},
								{ resetPage: true }
							)
						}
						rangeLabel={rangeLabel}
					/>

					{orders.length === 0 ? (
						<SellerOrdersFilteredEmpty onClear={clearFilters} />
					) : (
						<SellerOrdersListSection
							orders={orders}
							isPageFetching={isPageFetching}
							showPager={showPager}
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={goToPage}
							onOpenOrder={setSelectedId}
							onAction={setPendingAction}
						/>
					)}
				</>
			)}

			<Sheet
				open={Boolean(selectedId)}
				onOpenChange={(open) => {
					if (!open) setSelectedId(null)
				}}
			>
				<SheetContent
					side='right'
					className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
				>
					{selectedId ? (
						<SellerOrderDetailSheetContent
							orderId={selectedId}
							onAction={setPendingAction}
						/>
					) : null}
				</SheetContent>
			</Sheet>

			<OrderStatusConfirmDialog
				action={pendingAction}
				isPending={statusMutation.isPending}
				onOpenChange={(open) => {
					if (!open) setPendingAction(null)
				}}
				onConfirm={(action) => statusMutation.mutate(action)}
			/>
		</div>
	)
}
