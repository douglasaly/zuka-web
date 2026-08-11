import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	PublicReviewCard,
	StoreReviewsRef,
} from '@/modules/product/ui/components/reviews/review-card'
import { ReviewsPagination } from '@/modules/product/ui/components/reviews/reviews-pagination'
import type {
	ProductReviewSort,
	ProductReviewsResponse,
} from '../components/reviews/types'
import { ProductReviewsSummary } from './product-reviews-summary'
import { ProductReviewsToolbar } from './product-reviews-toolbar'

type ProductReviewsContentProps = {
	data: ProductReviewsResponse
	page: number
	rating: number | null
	sort: ProductReviewSort
	search: string
	isFetching: boolean
	isLoading: boolean
	resultLabel: string
	setSearch: (value: string) => void
	setPage: (page: number) => void
	setRating: (rating: number | null) => void
	setSort: (sort: ProductReviewSort) => void
	clearFilters: () => void
}

export function ProductReviewsContent({
	data,
	page,
	rating,
	sort,
	search,
	isFetching,
	isLoading,
	resultLabel,
	setSearch,
	setPage,
	setRating,
	setSort,
	clearFilters,
}: ProductReviewsContentProps) {
	const { store, summary, reviews, total, totalPages, perPage } = data

	return (
		<>
			<ProductReviewsSummary
				summary={summary}
				activeRating={rating}
				onSelectRating={setRating}
			/>

			{store ? <StoreReviewsRef store={store} /> : null}

			<ProductReviewsToolbar
				search={search}
				onSearchChange={setSearch}
				sort={sort}
				onSortChange={setSort}
				activeRating={rating}
				onClearRating={() => setRating(null)}
				resultLabel={resultLabel}
			/>

			<div
				className={cn(
					'space-y-3 transition-opacity duration-200 ease-out',
					isFetching && !isLoading && 'opacity-60'
				)}
				aria-busy={isFetching && !isLoading}
			>
				{reviews.length === 0 ? (
					<div className='rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center'>
						<p className='text-sm text-muted-foreground'>
							Nenhuma avaliação corresponde aos filtros actuais.
						</p>
						<Button
							variant='ghost'
							size='sm'
							className='mt-3 rounded-full'
							onClick={clearFilters}
						>
							Limpar filtros
						</Button>
					</div>
				) : (
					reviews.map((review) => (
						<PublicReviewCard key={review.id} review={review} />
					))
				)}
			</div>

			<ReviewsPagination
				currentPage={page}
				totalPages={totalPages}
				total={total}
				perPage={perPage}
				onPageChange={setPage}
			/>
		</>
	)
}
