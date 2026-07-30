'use client'

import { OrderStatusBadge } from '@/components/order-status-badge'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { ReviewBadge } from './review-badge'
import type { SellerOrder } from './types'
import { formatOrderDate } from './utils'

type OrderMobileCardProps = {
	order: SellerOrder
	onOpen: () => void
}

export function OrderMobileCard({ order, onOpen }: OrderMobileCardProps) {
	return (
		<button
			type='button'
			onClick={onOpen}
			className={cn(
				'flex w-full min-w-0 flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-left',
				'transition-colors duration-200 hover:bg-muted/40',
				'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
			)}
		>
			<div className='flex items-start justify-between gap-3'>
				<div className='min-w-0'>
					<p className='font-heading text-sm font-semibold tracking-tight'>
						#{order.shortId}
					</p>
					<p className='truncate text-sm font-medium'>
						{order.customerName}
					</p>
				</div>
				<OrderStatusBadge
					status={order.status}
					label={order.statusLabel}
				/>
			</div>
			<p className='truncate text-sm text-muted-foreground'>
				{order.itemsSummary}
			</p>
			<div className='flex items-center justify-between gap-2'>
				<span className='text-xs text-muted-foreground'>
					{formatOrderDate(order.date)}
				</span>
				<span className='text-sm font-semibold tabular-nums'>
					{formatPrice(order.total, order.currency)}
				</span>
			</div>
			<ReviewBadge state={order.reviewState} />
		</button>
	)
}
