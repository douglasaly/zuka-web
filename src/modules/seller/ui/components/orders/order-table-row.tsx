'use client'

import { CheckCircle2 } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/utils/format-price'
import { OrderActionsMenu } from './order-actions-menu'
import { ReviewBadge } from './review-badge'
import type { PendingAction, SellerOrder } from './types'
import { formatOrderDate } from './utils'

type OrderTableRowProps = {
	order: SellerOrder
	onOpen: () => void
	onAction: (action: PendingAction) => void
}

export function OrderTableRow({ order, onOpen, onAction }: OrderTableRowProps) {
	return (
		<TableRow
			className='cursor-pointer transition-colors duration-200'
			onClick={onOpen}
		>
			<TableCell className='px-4'>
				<span className='font-heading font-semibold tracking-tight'>
					#{order.shortId}
				</span>
			</TableCell>
			<TableCell className='max-w-48'>
				<p className='truncate font-medium'>{order.customerName}</p>
				{order.customerEmail ? (
					<p className='truncate text-xs text-muted-foreground'>
						{order.customerEmail}
					</p>
				) : null}
			</TableCell>
			<TableCell className='hidden max-w-56 truncate text-muted-foreground lg:table-cell'>
				{order.itemsSummary}
			</TableCell>
			<TableCell className='font-semibold tabular-nums'>
				{formatPrice(order.total, order.currency)}
			</TableCell>
			<TableCell className='hidden text-muted-foreground xl:table-cell'>
				{formatOrderDate(order.date)}
			</TableCell>
			<TableCell>
				<div className='flex flex-col items-start gap-1'>
					<OrderStatusBadge
						status={order.status}
						label={order.statusLabel}
					/>
					<ReviewBadge state={order.reviewState} />
				</div>
			</TableCell>
			<TableCell
				className='px-4 text-right'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='inline-flex items-center justify-end gap-0.5'>
					{order.allowedActions.markCompleted ? (
						<IconTooltipButton
							label='Marcar como entregue'
							onClick={() =>
								onAction({
									orderId: order.id,
									shortId: order.shortId,
									nextStatus: 'COMPLETED',
								})
							}
						>
							<CheckCircle2 className='size-4' />
						</IconTooltipButton>
					) : null}
					<OrderActionsMenu
						order={order}
						onAction={onAction}
						onOpen={onOpen}
					/>
				</div>
			</TableCell>
		</TableRow>
	)
}
