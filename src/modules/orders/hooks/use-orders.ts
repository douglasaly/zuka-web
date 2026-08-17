'use client'
import { useMemo, useState } from 'react'
import { flattenPages, useInfiniteList } from '@/hooks/use-infinite-list'
import { useUserProfile } from '@/hooks/use-user-profile'
import type {
	BuyerOrder,
	PeriodFilter,
	StatusFilter,
} from '@/modules/orders/types'

const PAGE_SIZE = 5
export type OrdersPage = {
	success: boolean
	data: BuyerOrder[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
	counts?: Record<StatusFilter, number> & {
		reviewEligible?: number
	}
	stores?: string[]
	pendingReviews?: BuyerOrder[]
}
function matchesSearch(order: BuyerOrder, q: string) {
	if (!q) return true
	const haystack = [
		order.shortId,
		order.id,
		order.storeName,
		...order.itemsPreview.map((i) => i.productName),
	]
		.join(' ')
		.toLowerCase()
	return haystack.includes(q)
}
export function useOrders() {
	const { profile, isAuthenticated } = useUserProfile()
	const [search, setSearch] = useState('')
	const [status, setStatus] = useState<StatusFilter>('all')
	const [period, setPeriod] = useState<PeriodFilter>('all')
	const [store, setStore] = useState('all')
	const extraParams = useMemo(() => {
		const params: Record<string, string> = {}
		if (status !== 'all') params.status = status
		if (period !== 'all') params.period = period
		if (store !== 'all') params.store = store
		return params
	}, [status, period, store])
	const {
		data,
		isLoading,
		isError,
		refetch,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteList<BuyerOrder>({
		queryKey: ['orders', profile?.id ?? 'anon', status, period, store],
		endpoint: '/api/orders',
		limit: PAGE_SIZE,
		extraParams,
		enabled: isAuthenticated,
	})
	const pages = data as
		| {
				pages: OrdersPage[]
		  }
		| undefined
	const orders = flattenPages<BuyerOrder>(pages)
	const statusCounts = useMemo(() => {
		const fromApi = pages?.pages[0]?.counts
		if (fromApi) {
			return {
				all: fromApi.all,
				pending: fromApi.pending,
				shipping: fromApi.shipping,
				completed: fromApi.completed,
				cancelled: fromApi.cancelled,
			} satisfies Record<StatusFilter, number>
		}
		return {
			all: 0,
			pending: 0,
			shipping: 0,
			completed: 0,
			cancelled: 0,
		} satisfies Record<StatusFilter, number>
	}, [pages])
	const pendingReviews = pages?.pages[0]?.pendingReviews ?? []
	const pendingReviewCount =
		pages?.pages[0]?.counts?.reviewEligible ?? pendingReviews.length
	const recentOrder = orders[0] ?? pendingReviews[0] ?? null
	const stores = useMemo(() => {
		const fromApi = pages?.pages[0]?.stores
		if (fromApi && fromApi.length > 0) return fromApi
		return [
			...new Set(orders.map((o) => o.storeName).filter(Boolean)),
		].sort((a, b) => a.localeCompare(b, 'pt'))
	}, [pages, orders])
	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase()
		return orders.filter((order) => matchesSearch(order, q))
	}, [orders, search])
	const hasFilters =
		search.trim() !== '' ||
		status !== 'all' ||
		period !== 'all' ||
		store !== 'all'
	const clearFilters = () => {
		setSearch('')
		setStatus('all')
		setPeriod('all')
		setStore('all')
	}
	const isEmptyAll =
		!isLoading &&
		!isError &&
		orders.length === 0 &&
		status === 'all' &&
		period === 'all' &&
		store === 'all' &&
		!search.trim()
	const showAside = !isLoading && !isError
	return {
		search,
		setSearch,
		status,
		setStatus,
		period,
		setPeriod,
		store,
		setStore,
		stores,
		statusCounts,
		filtered,
		hasFilters,
		clearFilters,
		isEmptyAll,
		showAside,
		pendingReviews,
		pendingReviewCount,
		recentOrder,
		isLoading,
		isError,
		refetch,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	}
}
