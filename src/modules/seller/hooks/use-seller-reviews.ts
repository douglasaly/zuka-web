'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDeferredValue, useMemo, useState } from 'react'
import type {
	ReviewScope,
	SellerReviewsResponse,
	SellerStoreReview,
} from '@/modules/seller/ui/components/reviews/types'

export function useSellerReviews() {
	const [scope, setScope] = useState<ReviewScope>('store')
	const [search, setSearch] = useState('')
	const deferredSearch = useDeferredValue(search.trim())
	const [needsReplyOnly, setNeedsReplyOnly] = useState(false)
	const queryClient = useQueryClient()

	const queryKey = [
		'seller-reviews',
		scope,
		deferredSearch,
		needsReplyOnly,
	] as const

	const { data, isLoading, isError, isFetching, refetch } =
		useQuery<SellerReviewsResponse>({
			queryKey,
			queryFn: async () => {
				const params = new URLSearchParams()
				params.set('scope', 'all')
				if (deferredSearch) params.set('search', deferredSearch)
				if (needsReplyOnly) params.set('needsReply', '1')
				const res = await fetch(`/api/seller/reviews?${params}`)
				if (!res.ok) throw new Error('Failed to load reviews')
				return res.json()
			},
		})

	const storeReviews = data?.storeReviews ?? []
	const productReviews = data?.productReviews ?? []

	const summary = data?.summary ?? {
		store: { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] },
		products: { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] },
	}

	const isEmptyStore =
		!isLoading &&
		summary.store.count === 0 &&
		summary.products.count === 0 &&
		!deferredSearch &&
		!needsReplyOnly

	const visibleCount =
		scope === 'store' ? storeReviews.length : productReviews.length

	const resultLabel = useMemo(() => {
		if (visibleCount === 0) return 'Nenhuma avaliação encontrada'
		if (scope === 'store') {
			return visibleCount === 1
				? '1 avaliação da loja'
				: `${visibleCount} avaliações da loja`
		}
		return visibleCount === 1
			? '1 avaliação de produto'
			: `${visibleCount} avaliações de produtos`
	}, [scope, visibleCount])

	function markReplied(reviewId: string, reply: string) {
		queryClient.setQueriesData<SellerReviewsResponse>(
			{ queryKey: ['seller-reviews'] },
			(old) => {
				if (!old) return old
				return {
					...old,
					storeReviews: old.storeReviews.map(
						(r: SellerStoreReview) =>
							r.id === reviewId
								? {
										...r,
										storeReply: reply,
										storeRepliedAt:
											new Date().toISOString(),
									}
								: r
					),
					productReviews: old.productReviews.map((p) =>
						p.reviewId === reviewId
							? { ...p, storeReply: reply }
							: p
					),
				}
			}
		)
	}

	function clearFilters() {
		setSearch('')
		setNeedsReplyOnly(false)
	}

	return {
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
		isFetching,
		refetch,
		markReplied,
	}
}
