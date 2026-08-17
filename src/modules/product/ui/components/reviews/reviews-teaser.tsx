'use client'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { StarRating } from './star-rating'
import type { RatingSummary } from './types'

type ReviewsTeaserProps = {
	productId: string
	summary: RatingSummary | null
	isLoading?: boolean
}
export function ReviewsTeaser({
	productId,
	summary,
	isLoading,
}: ReviewsTeaserProps) {
	if (isLoading) {
		return (
			<div aria-busy='true' aria-label='A carregar avaliações'>
				<Skeleton className='h-28 w-full rounded-2xl' />
			</div>
		)
	}
	if (!summary || summary.count === 0) {
		return (
			<section
				aria-labelledby='reviews-teaser-empty'
				className='rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-5'
			>
				<h2
					id='reviews-teaser-empty'
					className='font-heading text-base font-semibold'
				>
					Ainda sem avaliações
				</h2>
				<p className='mt-1 text-sm text-muted-foreground'>
					Quando alguém comprar e avaliar, a nota aparece aqui.
				</p>
			</section>
		)
	}
	return (
		<section
			aria-labelledby='reviews-teaser-heading'
			className='rounded-2xl border border-border/60 bg-card p-4 sm:p-5'
		>
			<div>
				<h2
					id='reviews-teaser-heading'
					className='font-heading text-base font-semibold'
				>
					Avaliações
				</h2>
				<div className='mt-2 flex flex-wrap items-center gap-2'>
					<span className='text-2xl font-bold tabular-nums tracking-tight'>
						{summary.average.toFixed(1)}
					</span>
					<StarRating rating={summary.average} size='md' />
					<span className='text-sm text-muted-foreground'>
						{summary.count === 1
							? '1 avaliação'
							: `${summary.count} avaliações`}
					</span>
				</div>
			</div>

			<Link
				href={`/product/${productId}/avaliacoes`}
				className='mt-4 flex min-h-11 items-center justify-between gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
			>
				Ver avaliações
				<ChevronRight className='size-4' aria-hidden />
			</Link>
		</section>
	)
}
