'use client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BuyerOrder } from '@/types'

type OrderDetailHeaderProps = {
	order: BuyerOrder
	guidance: {
		headline: string
		detail: string
	}
	tone: {
		panel: string
		ring: string
	}
	countLabel: string | null
}
export function OrderDetailHeader({
	order,
	guidance,
	tone,
	countLabel,
}: OrderDetailHeaderProps) {
	return (
		<header className='mb-6 space-y-3'>
			<Button
				variant='ghost'
				size='sm'
				className='-ml-2 min-h-10 gap-1.5 text-muted-foreground hover:text-foreground'
				render={<Link href='/feed/pedidos' />}
			>
				<ArrowLeft className='size-4' aria-hidden />
				Voltar aos pedidos
			</Button>

			<div
				className={cn(
					'relative overflow-hidden rounded-2xl bg-linear-to-br ring-1',
					tone.panel,
					tone.ring
				)}
			>
				<div className='relative space-y-4 p-5 sm:p-6'>
					<div className='flex items-start justify-between gap-3'>
						<div className='min-w-0'>
							<p className='text-xs text-muted-foreground'>
								Pedido #{order.shortId}
							</p>
							<h1 className='mt-1 font-heading text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl'>
								{guidance.headline}
							</h1>
						</div>
						<OrderStatusBadge
							status={order.status}
							label={order.statusLabel}
							className='shrink-0'
						/>
					</div>

					<p className='max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-[15px]'>
						{guidance.detail}
					</p>

					<p className='text-xs text-muted-foreground'>
						{[order.date, countLabel].filter(Boolean).join(', ')}
					</p>
				</div>
			</div>
		</header>
	)
}
