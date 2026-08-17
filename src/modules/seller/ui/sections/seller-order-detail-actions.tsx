'use client'
import { CheckCircle2, Truck, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import type { PendingAction } from '@/modules/seller/ui/components/orders/types'

type SellerOrderDetailActionsProps = {
	status: OrderStatus
	shortId: string
	canUpdateOrder: boolean
	onRequestStatus: (nextStatus: PendingAction['nextStatus']) => void
}
export function SellerOrderDetailActions({
	status,
	shortId,
	canUpdateOrder,
	onRequestStatus,
}: SellerOrderDetailActionsProps) {
	if (
		!canUpdateOrder ||
		(status !== 'PENDING' &&
			status !== 'CONTACTED' &&
			status !== 'SHIPPING')
	) {
		return null
	}
	return (
		<section className='flex flex-wrap gap-2'>
			{status === 'SHIPPING' ? (
				<Button
					className='rounded-full transition-all duration-200'
					aria-label={`Marcar pedido ${shortId} como entregue`}
					onClick={() => onRequestStatus('COMPLETED')}
				>
					<CheckCircle2 className='size-4' />
					Marcar como entregue
				</Button>
			) : null}
			{status === 'PENDING' || status === 'CONTACTED' ? (
				<Button
					className='rounded-full transition-all duration-200'
					aria-label={`Marcar pedido ${shortId} como em envio`}
					onClick={() => onRequestStatus('SHIPPING')}
				>
					<Truck className='size-4' />
					Marcar como em envio
				</Button>
			) : null}
			<Button
				variant='destructive'
				className='rounded-full transition-all duration-200'
				aria-label={`Cancelar pedido ${shortId}`}
				onClick={() => onRequestStatus('CANCELLED')}
			>
				<XCircle className='size-4' />
				Cancelar pedido
			</Button>
		</section>
	)
}
