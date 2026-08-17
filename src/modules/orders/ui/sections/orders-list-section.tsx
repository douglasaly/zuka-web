import { Button } from '@/components/ui/button'
import type { BuyerOrder } from '@/modules/orders/types'
import { OrderCard } from '../components/order-card'
import { OrdersEmptyAll, OrdersEmptyFiltered } from './orders-gates'

type OrdersListSectionProps = {
	isEmptyAll: boolean
	filtered: BuyerOrder[]
	hasFilters: boolean
	onClearFilters: () => void
	hasNextPage: boolean
	isFetchingNextPage: boolean
	onLoadMore: () => void
}
export function OrdersListSection({
	isEmptyAll,
	filtered,
	hasFilters,
	onClearFilters,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
}: OrdersListSectionProps) {
	if (isEmptyAll) {
		return <OrdersEmptyAll />
	}
	if (filtered.length === 0) {
		return (
			<OrdersEmptyFiltered
				hasFilters={hasFilters}
				onClear={onClearFilters}
			/>
		)
	}
	return (
		<div className='space-y-3'>
			<p className='text-sm text-muted-foreground' aria-live='polite'>
				{filtered.length} {filtered.length === 1 ? 'pedido' : 'pedidos'}
			</p>
			<ul className='grid gap-3'>
				{filtered.map((order) => (
					<li key={order.id}>
						<OrderCard order={order} />
					</li>
				))}
			</ul>

			{hasNextPage ? (
				<div className='flex justify-center pt-2'>
					<Button
						variant='ghost'
						size='sm'
						onClick={onLoadMore}
						disabled={isFetchingNextPage}
						className='min-h-10 text-sm text-secondary hover:text-secondary/80'
					>
						{isFetchingNextPage
							? 'A carregar pedidos...'
							: 'Carregar mais pedidos'}
					</Button>
				</div>
			) : null}
		</div>
	)
}
