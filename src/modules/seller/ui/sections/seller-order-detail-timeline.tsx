'use client'
import type { OrderStatus } from '@/lib/orders/status-transitions'
import { cn } from '@/lib/utils'

type TimelineStep = {
	status: OrderStatus
	label: string
	at: string
	note?: string
}
type SellerOrderDetailTimelineProps = {
	timeline: TimelineStep[]
}
function formatDateTime(iso: string) {
	return new Date(iso).toLocaleString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
export function SellerOrderDetailTimeline({
	timeline,
}: SellerOrderDetailTimelineProps) {
	return (
		<section className='rounded-xl border border-border bg-card p-5'>
			<p className='mb-4 text-xs font-medium text-muted-foreground'>
				Histórico
			</p>
			<ol className='relative space-y-4 border-l border-border pl-4'>
				{timeline.map((step, index) => (
					<li key={`${step.status}-${index}`}>
						<span
							className={cn(
								'absolute -left-1.5 mt-1.5 size-3 rounded-full border-2 border-background',
								step.status === 'COMPLETED' && 'bg-emerald-500',
								step.status === 'SHIPPING' && 'bg-sky-500',
								step.status === 'PENDING' && 'bg-amber-400',
								step.status === 'CONTACTED' && 'bg-amber-500',
								step.status === 'CANCELLED' &&
									'bg-muted-foreground'
							)}
						/>
						<p className='text-sm font-medium'>{step.label}</p>
						<p className='text-xs text-muted-foreground'>
							{formatDateTime(step.at)}
						</p>
						{step.note ? (
							<p className='mt-0.5 text-xs text-muted-foreground'>
								{step.note}
							</p>
						) : null}
					</li>
				))}
			</ol>
		</section>
	)
}
