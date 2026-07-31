'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDeferredValue, useEffect, useState } from 'react'
import type {
	ProductReviewSort,
	ProductReviewsResponse,
} from '@/modules/product/ui/components/reviews/types'

async function fetchProductReviews(
	productId: string,
	params: {
		page: number
		perPage: number
		rating: number | null
		sort: ProductReviewSort
		search: string
	}
): Promise<ProductReviewsResponse> {
	const qs = new URLSearchParams()
	qs.set('page', String(params.page))
	qs.set('perPage', String(params.perPage))
	qs.set('sort', params.sort)
	if (params.rating != null) qs.set('rating', String(params.rating))
	if (params.search) qs.set('search', params.search)

	const res = await fetch(`/api/products/${productId}/reviews?${qs}`)
	if (!res.ok) throw new Error('Failed to load reviews')
	return res.json()
}

export function useProductReviews(productId: string) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)
	const ratingParam = searchParams.get('rating')
	const rating =
		ratingParam && ['1', '2', '3', '4', '5'].includes(ratingParam)
			? Number(ratingParam)
			: null
	const sort = (searchParams.get('sort') ?? 'recent') as ProductReviewSort
	const searchFromUrl = searchParams.get('search') ?? ''

	const [search, setSearch] = useState(searchFromUrl)
	const deferredSearch = useDeferredValue(search.trim())

	useEffect(() => {
		setSearch(searchFromUrl)
	}, [searchFromUrl])

	useEffect(() => {
		const current = searchFromUrl.trim()
		if (deferredSearch === current) return
		const t = window.setTimeout(() => {
			const next = new URLSearchParams(searchParams.toString())
			if (deferredSearch) next.set('search', deferredSearch)
			else next.delete('search')
			next.delete('page')
			const qs = next.toString()
			router.replace(qs ? `${pathname}?${qs}` : pathname, {
				scroll: false,
			})
		}, 300)
		return () => window.clearTimeout(t)
	}, [deferredSearch, pathname, router, searchFromUrl, searchParams])

	function updateParams(
		patch: Record<string, string | number | null | undefined>
	) {
		const next = new URLSearchParams(searchParams.toString())
		for (const [key, value] of Object.entries(patch)) {
			if (value == null || value === '') {
				next.delete(key)
			} else {
				next.set(key, String(value))
			}
		}
		const qs = next.toString()
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
	}

	const query = useQuery({
		queryKey: [
			'product-reviews',
			productId,
			page,
			rating,
			sort,
			deferredSearch,
		],
		queryFn: () =>
			fetchProductReviews(productId, {
				page,
				perPage: 10,
				rating,
				sort,
				search: deferredSearch,
			}),
		placeholderData: (prev) => prev,
	})

	function setPage(nextPage: number) {
		updateParams({ page: nextPage <= 1 ? null : nextPage })
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	function setRating(next: number | null) {
		updateParams({
			rating: next,
			page: 1,
		})
	}

	function setSort(next: ProductReviewSort) {
		updateParams({ sort: next === 'recent' ? null : next, page: 1 })
	}

	function clearFilters() {
		setSearch('')
		router.replace(pathname, { scroll: false })
	}

	const data = query.data
	const isEmpty =
		!query.isLoading &&
		(data?.summary.count ?? 0) === 0 &&
		!rating &&
		!deferredSearch

	return {
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
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isError: query.isError,
		refetch: query.refetch,
		isEmpty,
	}
}
