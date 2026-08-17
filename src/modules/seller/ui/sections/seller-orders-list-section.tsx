'use client'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { OrderMobileCard } from '../components/orders/order-mobile-card'
import { OrderTableRow } from '../components/orders/order-table-row'
import { OrdersPagination } from '../components/orders/orders-pagination'
import type { PendingAction, SellerOrder } from '../components/orders/types'

type SellerOrdersListSectionProps = {
	orders: SellerOrder[]
	isPageFetching: boolean
	showPager: boolean
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	onOpenOrder: (id: string) => void
	onAction: (action: PendingAction) => void
}
export function SellerOrdersListSection({
	orders,
	isPageFetching,
	showPager,
	currentPage,
	totalPages,
	onPageChange,
	onOpenOrder,
	onAction,
}: SellerOrdersListSectionProps) {
	return (
		<>
			<div className='relative'>
				{isPageFetching ? (
					<div
						className='absolute inset-0 z-10 rounded-xl bg-background/50 transition-opacity duration-200'
						aria-hidden
					/>
				) : null}

				<ul className='flex w-full flex-col gap-2 md:hidden'>
					{orders.map((order) => (
						<li key={order.id}>
							<OrderMobileCard
								order={order}
								onOpen={() => onOpenOrder(order.id)}
							/>
						</li>
					))}
				</ul>

				<div className='hidden w-full overflow-hidden rounded-xl border border-border md:block'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/40 hover:bg-muted/40'>
								<TableHead className='px-4'>Pedido</TableHead>
								<TableHead>Cliente</TableHead>
								<TableHead className='hidden lg:table-cell'>
									Itens
								</TableHead>
								<TableHead>Total</TableHead>
								<TableHead className='hidden xl:table-cell'>
									Data
								</TableHead>
								<TableHead>Estado</TableHead>
								<TableHead className='px-4 text-right'>
									Acções
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<OrderTableRow
									key={order.id}
									order={order}
									onOpen={() => onOpenOrder(order.id)}
									onAction={onAction}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			{showPager ? (
				<OrdersPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
				/>
			) : null}
		</>
	)
}
