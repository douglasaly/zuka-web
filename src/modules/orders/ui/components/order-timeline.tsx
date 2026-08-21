'use client'
import { Check, Circle, PackageX, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTimelineAt } from '@/modules/orders/lib/map-buyer-order'
import type { BuyerOrderTimelineStep } from '@/types'

type OrderTimelineProps = {
	steps: BuyerOrderTimelineStep[]
}
export function OrderTimeline({ steps }: OrderTimelineProps) {
	return (
		<ol className='space-y-0'>
			{steps.map((step, index) => {
				const isLast = index === steps.length - 1
				const Icon =
					step.status === 'CANCELLED'
						? PackageX
						: step.status === 'SHIPPING'
							? Truck
							: step.state === 'done' || step.state === 'current'
								? Check
								: Circle
				return (
					<li
						key={`${step.status}-${index}`}
						className='relative flex gap-3.5 pb-5 last:pb-0'
					>
						{!isLast ? (
							<span
								aria-hidden
								className={cn(
									'absolute top-8 bottom-0 left-3.5 w-px',
									step.state === 'upcoming'
										? 'bg-border'
										: 'bg-foreground/20'
								)}
							/>
						) : null}
						<span
							className={cn(
								'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors',
								step.state === 'current' &&
									'border-secondary bg-secondary text-secondary-foreground shadow-[0_6px_16px_-6px_color-mix(in_oklch,#e8340a_55%,transparent)]',
								step.state === 'done' &&
									'border-foreground/15 bg-foreground text-background',
								step.state === 'upcoming' &&
									'border-border bg-background text-muted-foreground'
							)}
							aria-current={
								step.state === 'current' ? 'step' : undefined
							}
						>
							<Icon className='size-3.5' aria-hidden />
						</span>
						<div className='min-w-0 pt-0.5'>
							<p
								className={cn(
									'text-sm font-medium',
									step.state === 'current' &&
										'text-foreground',
									step.state === 'upcoming' &&
										'text-muted-foreground'
								)}
							>
								{step.label}
								{step.state === 'current' ? (
									<span className='sr-only'> (actual)</span>
								) : null}
							</p>
							{step.at && step.state !== 'upcoming' ? (
								<p className='mt-0.5 text-xs text-muted-foreground'>
									{formatTimelineAt(step.at)}
								</p>
							) : step.state === 'upcoming' ? (
								<p className='mt-0.5 text-xs text-muted-foreground'>
									Aguarda
								</p>
							) : null}
						</div>
					</li>
				)
			})}
		</ol>
	)
}
