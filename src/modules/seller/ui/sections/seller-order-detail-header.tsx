'use client'
import { ArrowLeft } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { OrderStatusBadge } from '@/components/order-status-badge'
import type { OrderStatus } from '@/lib/orders/status-transitions'

type SellerOrderDetailHeaderProps = {
	shortId: string
	status: OrderStatus
	statusLabel: string
	reviewState: 'none' | 'awaiting' | 'done'
}
export function SellerOrderDetailHeader({
	shortId,
	status,
	statusLabel,
	reviewState,
}: SellerOrderDetailHeaderProps) {
	return (
		<>
			<div className='flex flex-wrap items-center gap-3'>
				<IconTooltipButton
					label='Voltar aos pedidos'
					href='/dashboard/seller/pedidos'
				>
					<ArrowLeft className='size-4' />
				</IconTooltipButton>
				<div className='min-w-0 flex-1'>
					<p className='text-sm text-muted-foreground'>
						Pedido #{shortId}
					</p>
					<h1 className='font-heading text-xl font-bold tracking-tight'>
						Detalhe do pedido
					</h1>
				</div>
				<OrderStatusBadge status={status} label={statusLabel} />
			</div>

			{reviewState === 'awaiting' ? (
				<p className='rounded-xl border border-border bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200'>
					Aguardando avaliação do cliente.
				</p>
			) : null}
		</>
	)
}
