'use client'

/**
 * THESIS: Trust through readable proof — product context + store note + scannable list.
 * Refuses marketplace dump of every badge/filter without data.
 * OWN-WORLD: Zuka PDP language (max-w-4xl, rounded-2xl, amber stars, full-bleed mobile).
 * STORY: Orient on product → trust store → scan distribution → read confirmed purchases.
 * FIRST VIEWPORT: back link + product strip + average + store ref.
 * FORM: Dedicated Read surface extending product module; local extension of incumbent world.
 */

import { useProductReviews } from '@/modules/product/hooks/use-product-reviews'
import { ProductReviewsContent } from '../sections/product-reviews-content'
import {
	ProductReviewsEmpty,
	ProductReviewsError,
	ProductReviewsLoading,
	ProductReviewsNotFound,
} from '../sections/product-reviews-gates'
import { ProductReviewsHeader } from '../sections/product-reviews-header'

type ProductReviewsViewProps = {
	productId: string
}

export function ProductReviewsView({ productId }: ProductReviewsViewProps) {
	const {
		page,
		rating,
		sort,
		search,
		setSearch,
		setPage,
		setRating,
		setSort,
		clearFilters,
		data,
		isLoading,
		isFetching,
		isError,
		refetch,
		isEmpty,
	} = useProductReviews(productId)

	if (isLoading && !data) {
		return <ProductReviewsLoading />
	}

	if (isError && !data) {
		return <ProductReviewsError onRetry={() => refetch()} />
	}

	if (!data) {
		return <ProductReviewsNotFound />
	}

	const { product, total } = data

	const resultLabel =
		total === 0
			? 'Nenhuma avaliação encontrada'
			: total === 1
				? '1 avaliação'
				: `${total} avaliações`

	return (
		<div className='mx-auto max-w-4xl pb-12 pt-2'>
			<div className='space-y-6 px-4 md:px-0'>
				<ProductReviewsHeader product={product} />

				{isEmpty ? (
					<ProductReviewsEmpty productId={product.id} />
				) : (
					<ProductReviewsContent
						data={data}
						page={page}
						rating={rating}
						sort={sort}
						search={search}
						isFetching={isFetching}
						isLoading={isLoading}
						resultLabel={resultLabel}
						setSearch={setSearch}
						setPage={setPage}
						setRating={setRating}
						setSort={setSort}
						clearFilters={clearFilters}
					/>
				)}
			</div>
		</div>
	)
}
