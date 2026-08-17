import { RatingDistribution } from '@/modules/product/ui/components/reviews/rating-distribution'
import { StarRating } from '@/modules/product/ui/components/reviews/star-rating'
import type { ProductReviewsResponse } from '../components/reviews/types'

type ProductReviewsSummaryProps = {
	summary: ProductReviewsResponse['summary']
	activeRating: number | null
	onSelectRating: (rating: number | null) => void
}
export function ProductReviewsSummary({
	summary,
	activeRating,
	onSelectRating,
}: ProductReviewsSummaryProps) {
	return (
		<section
			aria-label='Nota do produto'
			className='grid gap-5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start'
		>
			<div className='rounded-2xl border border-border/60 bg-card p-4 text-center sm:text-left'>
				<p className='text-4xl font-bold tabular-nums tracking-tight'>
					{summary.average.toFixed(1)}
				</p>
				<div className='mt-1 flex justify-center sm:justify-start'>
					<StarRating rating={summary.average} size='md' />
				</div>
				<p className='mt-2 text-xs text-muted-foreground'>
					Nota do produto
				</p>
				<p className='text-sm tabular-nums text-muted-foreground'>
					{summary.count === 1
						? '1 avaliação'
						: `${summary.count} avaliações`}
				</p>
			</div>
			<RatingDistribution
				summary={summary}
				activeRating={activeRating}
				onSelectRating={onSelectRating}
				interactive
			/>
		</section>
	)
}
