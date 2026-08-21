'use client'
import { Separator } from '@/components/ui/separator'
import type { BuyerOrderTimelineStep } from '@/types'
import { OrderTimeline } from '../components/order-timeline'

type OrderDetailProgressProps = {
	timeline: BuyerOrderTimelineStep[]
	notes: string | null
}
export function OrderDetailProgress({
	timeline,
	notes,
}: OrderDetailProgressProps) {
	return (
		<section className='space-y-3' aria-labelledby='order-progress'>
			<h2
				id='order-progress'
				className='font-heading text-sm font-semibold tracking-tight'
			>
				Estado do pedido
			</h2>
			<div className='rounded-2xl border border-border/70 bg-card p-4 sm:p-5'>
				<OrderTimeline steps={timeline} />
				{notes ? (
					<>
						<Separator className='my-4' />
						<div>
							<p className='text-xs font-medium text-muted-foreground'>
								Nota da loja
							</p>
							<p className='mt-1 text-sm leading-relaxed text-foreground'>
								{notes}
							</p>
						</div>
					</>
				) : null}
			</div>
		</section>
	)
}
