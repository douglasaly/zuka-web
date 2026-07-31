'use client'

import { Star } from 'lucide-react'
import { StarRating } from './star-rating'
import type { RatingSummary } from './types'

type ReviewsSummaryProps = {
	store: RatingSummary
	products: RatingSummary
	activeScope: 'store' | 'product'
}

export function ReviewsSummary({
	store,
	products,
	activeScope,
}: ReviewsSummaryProps) {
	const active = activeScope === 'store' ? store : products
	const label =
		activeScope === 'store' ? 'Média da loja' : 'Média dos produtos'
	const countLabel =
		active.count === 1 ? '1 avaliação' : `${active.count} avaliações`

	const maxCount = Math.max(...active.distribution, 1)

	return (
		<div className='grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr]'>
			<div className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-5 py-4'>
				<span className='font-heading text-3xl font-bold tabular-nums tracking-tight'>
					{active.count === 0 ? '—' : active.average.toFixed(1)}
				</span>
				<div className='min-w-0 space-y-0.5'>
					<StarRating rating={active.average} size='md' />
					<p className='text-xs text-muted-foreground'>{label}</p>
					<p className='text-xs tabular-nums text-muted-foreground'>
						{countLabel}
					</p>
				</div>
			</div>

			<div className='rounded-2xl border border-border/60 bg-card px-5 py-4'>
				<p className='mb-3 text-sm font-medium text-foreground'>
					Distribuição de notas
				</p>
				{active.count === 0 ? (
					<p className='text-sm text-muted-foreground'>
						Ainda não há notas para mostrar.
					</p>
				) : (
					<div className='space-y-1.5'>
						{[5, 4, 3, 2, 1].map((stars) => {
							const count = active.distribution[stars - 1] ?? 0
							return (
								<div
									key={stars}
									className='flex items-center gap-2 text-sm'
								>
									<span className='w-3 tabular-nums text-muted-foreground'>
										{stars}
									</span>
									<Star
										className='size-3 fill-amber-500 text-amber-500'
										aria-hidden
									/>
									<div className='h-2 flex-1 overflow-hidden rounded-full bg-muted'>
										<div
											className='h-full rounded-full bg-amber-500 transition-[width] duration-300'
											style={{
												width: `${(count / maxCount) * 100}%`,
											}}
										/>
									</div>
									<span className='w-6 text-right text-xs tabular-nums text-muted-foreground'>
										{count}
									</span>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
