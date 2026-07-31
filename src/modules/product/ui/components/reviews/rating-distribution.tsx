'use client'

import { cn } from '@/lib/utils'
import type { RatingSummary } from './types'

type RatingDistributionProps = {
	summary: RatingSummary
	activeRating?: number | null
	onSelectRating?: (rating: number | null) => void
	interactive?: boolean
	className?: string
}

export function RatingDistribution({
	summary,
	activeRating = null,
	onSelectRating,
	interactive = true,
	className,
}: RatingDistributionProps) {
	const maxCount = Math.max(...summary.distribution, 1)

	return (
		<div className={cn('space-y-2', className)}>
			<p className='text-sm font-medium text-foreground'>
				Como os clientes avaliam
			</p>
			<ul className='space-y-1.5'>
				{[5, 4, 3, 2, 1].map((star) => {
					const count = summary.distribution[star - 1] ?? 0
					const pct = Math.round((count / maxCount) * 100)
					const active = activeRating === star
					const rowClass = cn(
						'flex w-full min-h-11 items-center gap-2 rounded-xl px-1.5 text-left outline-none',
						interactive &&
							'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
						interactive &&
							(active
								? 'bg-muted'
								: 'transition-colors hover:bg-muted/50')
					)
					const cells = (
						<>
							<span className='w-6 shrink-0 text-sm tabular-nums text-muted-foreground'>
								{star}★
							</span>
							<span
								className='relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted'
								aria-hidden
							>
								<span
									className='absolute inset-y-0 left-0 rounded-full bg-amber-500 transition-[width] duration-300 ease-out'
									style={{ width: `${pct}%` }}
								/>
							</span>
							<span className='w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground'>
								{count}
							</span>
						</>
					)
					return (
						<li key={star}>
							{interactive && onSelectRating ? (
								<button
									type='button'
									aria-pressed={active}
									aria-label={`Filtrar ${star} estrelas, ${count} avaliações`}
									onClick={() =>
										onSelectRating(active ? null : star)
									}
									className={rowClass}
								>
									{cells}
								</button>
							) : (
								<div className={rowClass}>{cells}</div>
							)}
						</li>
					)
				})}
			</ul>
		</div>
	)
}
