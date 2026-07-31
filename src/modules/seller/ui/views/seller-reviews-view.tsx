'use client'

/**
 * THESIS: Reviews as a scannable reputation inbox — store vs product scopes,
 * reply when needed; refuses a single undifferentiated card dump.
 * OWN-WORLD: Seller Operate (rounded-2xl, meta, list density).
 * STORY: Scan ratings → filter → reply to the customer.
 * FIRST VIEWPORT: Summary + scope tabs + list.
 * FORM: Extend seller dashboard Operate surface.
 */

import { useSellerReviews } from '@/modules/seller/hooks/use-seller-reviews'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'
import { ReviewsSummary } from '@/modules/seller/ui/components/reviews/reviews-summary'
import {
	ProductReviewCard,
	StoreReviewCard,
} from '@/modules/seller/ui/components/reviews/store-review-card'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import {
	ReviewsSkeleton,
	SellerReviewsEmptyState,
	SellerReviewsErrorState,
	SellerReviewsFilteredEmpty,
	SellerReviewsToolbar,
} from '@/modules/seller/ui/sections/seller-reviews-toolbar'

export const SellerReviewsView = () => {
	useSetSellerPageMeta({
		title: 'Avaliações',
		crumbs: ['Dashboard', 'Avaliações'],
	})

	const {
		scope,
		setScope,
		search,
		setSearch,
		needsReplyOnly,
		setNeedsReplyOnly,
		clearFilters,
		storeReviews,
		productReviews,
		summary,
		resultLabel,
		visibleCount,
		isEmptyStore,
		isLoading,
		isError,
		refetch,
		markReplied,
	} = useSellerReviews()

	const { can } = useSellerAccess()
	const canReply = can('review.reply')

	if (isLoading) return <ReviewsSkeleton />

	if (isError) {
		return <SellerReviewsErrorState onRetry={() => refetch()} />
	}

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<p className='max-w-3xl text-sm leading-relaxed text-muted-foreground'>
				Veja o que os clientes dizem sobre o atendimento da loja e sobre
				os produtos
			</p>

			{isEmptyStore ? (
				<SellerReviewsEmptyState />
			) : (
				<>
					<ReviewsSummary
						store={summary.store}
						products={summary.products}
						activeScope={scope}
					/>

					<SellerReviewsToolbar
						scope={scope}
						onScopeChange={setScope}
						search={search}
						onSearchChange={setSearch}
						needsReplyOnly={needsReplyOnly}
						onNeedsReplyChange={setNeedsReplyOnly}
						resultLabel={resultLabel}
					/>

					{visibleCount === 0 ? (
						<SellerReviewsFilteredEmpty onClear={clearFilters} />
					) : scope === 'store' ? (
						<div className='space-y-3'>
							{storeReviews.map((review) => (
								<StoreReviewCard
									key={review.id}
									review={review}
									onReplied={markReplied}
									canReply={canReply}
								/>
							))}
						</div>
					) : (
						<div className='space-y-3'>
							{productReviews.map((review) => (
								<ProductReviewCard
									key={review.id}
									review={review}
								/>
							))}
						</div>
					)}
				</>
			)}
		</div>
	)
}
