'use client'
import { CheckCircle2, Ellipsis, Package, Truck, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PendingAction, SellerOrder } from './types'

type OrderActionsMenuProps = {
	order: SellerOrder
	onAction: (action: PendingAction) => void
	onOpen: () => void
}
export function OrderActionsMenu({
	order,
	onAction,
	onOpen,
}: OrderActionsMenuProps) {
	const hasStatusAction =
		order.allowedActions.markCompleted ||
		order.allowedActions.markShipping ||
		order.allowedActions.cancel
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant='ghost'
						size='icon-sm'
						className='rounded-full'
						aria-label={`Acções do pedido ${order.shortId}`}
					/>
				}
			>
				<Ellipsis className='size-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-48'>
				<DropdownMenuItem onClick={onOpen}>
					<Package className='size-4' />
					Ver detalhe
				</DropdownMenuItem>
				{hasStatusAction ? <DropdownMenuSeparator /> : null}
				{order.allowedActions.markCompleted ? (
					<DropdownMenuItem
						onClick={() =>
							onAction({
								orderId: order.id,
								shortId: order.shortId,
								nextStatus: 'COMPLETED',
							})
						}
					>
						<CheckCircle2 className='size-4' />
						Marcar como entregue
					</DropdownMenuItem>
				) : null}
				{order.allowedActions.markShipping ? (
					<DropdownMenuItem
						onClick={() =>
							onAction({
								orderId: order.id,
								shortId: order.shortId,
								nextStatus: 'SHIPPING',
							})
						}
					>
						<Truck className='size-4' />
						Marcar como em envio
					</DropdownMenuItem>
				) : null}
				{order.allowedActions.cancel ? (
					<DropdownMenuItem
						variant='destructive'
						onClick={() =>
							onAction({
								orderId: order.id,
								shortId: order.shortId,
								nextStatus: 'CANCELLED',
							})
						}
					>
						<XCircle className='size-4' />
						Cancelar pedido
					</DropdownMenuItem>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
