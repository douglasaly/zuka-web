'use client'
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	useDeferredValue,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react'
import { toast } from 'sonner'
import { DEFAULT_PER_PAGE } from '@/modules/seller/ui/components/orders/constants'
import type {
	OrdersResponse,
	PendingAction,
} from '@/modules/seller/ui/components/orders/types'
import {
	confirmCopy,
	parsePerPage,
} from '@/modules/seller/ui/components/orders/utils'
export function useSellerOrders() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [, startTransition] = useTransition()
	const queryClient = useQueryClient()
	const page = Math.max(Number(searchParams.get('page')) || 1, 1)
	const perPage = parsePerPage(searchParams.get('perPage'))
	const statusFilter = searchParams.get('status') ?? 'all'
	const dateFilter = searchParams.get('date') ?? 'all'
	const searchFromUrl = searchParams.get('q') ?? ''
	const [searchInput, setSearchInput] = useState(searchFromUrl)
	const deferredSearch = useDeferredValue(searchInput)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [pendingAction, setPendingAction] = useState<PendingAction | null>(
		null
	)
	useEffect(() => {
		setSearchInput(searchFromUrl)
	}, [searchFromUrl])
	function replaceParams(
		patch: Record<string, string | null>,
		options?: {
			resetPage?: boolean
		}
	) {
		const next = new URLSearchParams(searchParams.toString())
		for (const [key, value] of Object.entries(patch)) {
			if (value == null || value === '' || value === 'all') {
				next.delete(key)
			} else {
				next.set(key, value)
			}
		}
		if (options?.resetPage) next.delete('page')
		if (next.get('perPage') === String(DEFAULT_PER_PAGE)) {
			next.delete('perPage')
		}
		const qs = next.toString()
		startTransition(() => {
			router.replace(qs ? `${pathname}?${qs}` : pathname, {
				scroll: false,
			})
		})
	}
	useEffect(() => {
		const trimmed = deferredSearch.trim()
		const current = searchParams.get('q') ?? ''
		if (trimmed === current) return
		const next = new URLSearchParams(searchParams.toString())
		if (trimmed) next.set('q', trimmed)
		else next.delete('q')
		next.delete('page')
		const qs = next.toString()
		startTransition(() => {
			router.replace(qs ? `${pathname}?${qs}` : pathname, {
				scroll: false,
			})
		})
	}, [deferredSearch, searchParams, pathname, router])
	const apiParams = useMemo(() => {
		const p = new URLSearchParams()
		p.set('page', String(page))
		p.set('perPage', String(perPage))
		if (statusFilter !== 'all') p.set('status', statusFilter)
		if (dateFilter !== 'all') p.set('date', dateFilter)
		if (searchFromUrl.trim()) p.set('search', searchFromUrl.trim())
		return p.toString()
	}, [page, perPage, statusFilter, dateFilter, searchFromUrl])
	const { data, isLoading, isError, isFetching, refetch } =
		useQuery<OrdersResponse>({
			queryKey: ['seller-orders', apiParams],
			queryFn: async () => {
				const res = await fetch(`/api/seller/orders?${apiParams}`, {
					credentials: 'include',
				})
				if (!res.ok) throw new Error('Failed to load orders')
				return res.json()
			},
			placeholderData: keepPreviousData,
		})
	const statusMutation = useMutation({
		mutationFn: async (action: PendingAction) => {
			const res = await fetch(`/api/seller/orders/${action.orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: action.nextStatus }),
			})
			const json = await res.json()
			if (!res.ok) {
				throw new Error(
					json.error ?? 'Não foi possível actualizar o pedido'
				)
			}
			return { action, order: json.order }
		},
		onMutate: async (action) => {
			await queryClient.cancelQueries({ queryKey: ['seller-orders'] })
			const previous = queryClient.getQueriesData<OrdersResponse>({
				queryKey: ['seller-orders'],
			})
			queryClient.setQueriesData<OrdersResponse>(
				{ queryKey: ['seller-orders'] },
				(old) => {
					if (!old?.orders) return old
					return {
						...old,
						orders: old.orders.map((o) => {
							if (o.id !== action.orderId) return o
							const status = action.nextStatus
							const labels = {
								SHIPPING: 'Em envio',
								COMPLETED: 'Entregue',
								CANCELLED: 'Cancelado',
							} as const
							return {
								...o,
								status,
								statusLabel: labels[status],
								reviewState:
									status === 'COMPLETED'
										? ('awaiting' as const)
										: o.reviewState,
								reviewEligible: status === 'COMPLETED',
								allowedActions: {
									markShipping: false,
									markCompleted: false,
									cancel: false,
								},
							}
						}),
					}
				}
			)
			return { previous }
		},
		onError: (error: Error, action, context) => {
			if (context?.previous) {
				for (const [key, value] of context.previous) {
					queryClient.setQueryData(key, value)
				}
			}
			toast.error(error.message, {
				action: {
					label: 'Tentar novamente',
					onClick: () => statusMutation.mutate(action),
				},
			})
		},
		onSuccess: ({ action }) => {
			toast.success(confirmCopy(action).success)
			setPendingAction(null)
			queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
			queryClient.invalidateQueries({
				queryKey: ['seller-order', action.orderId],
			})
			queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
			queryClient.invalidateQueries({
				queryKey: ['seller-dashboard-orders'],
			})
		},
	})
	useEffect(() => {
		void queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
	}, [queryClient])
	const orders = data?.orders ?? []
	const total = data?.total ?? 0
	const totalPages = data?.totalPages ?? 1
	const currentPage = data?.page ?? page
	const isEmptyStore =
		total === 0 &&
		statusFilter === 'all' &&
		!searchFromUrl &&
		dateFilter === 'all' &&
		!isLoading
	const rangeStart = total === 0 ? 0 : (currentPage - 1) * perPage + 1
	const rangeEnd = Math.min(currentPage * perPage, total)
	const showPager = total > 0
	const isPageFetching = isFetching && !isLoading
	const rangeLabel =
		total === 0
			? 'Nenhum pedido encontrado'
			: `Mostrando ${rangeStart}–${rangeEnd} de ${total} ${total === 1 ? 'pedido' : 'pedidos'}`
	function goToPage(nextPage: number) {
		if (nextPage < 1 || nextPage > totalPages) return
		replaceParams({
			page: nextPage <= 1 ? null : String(nextPage),
			perPage: perPage === DEFAULT_PER_PAGE ? null : String(perPage),
		})
	}
	function clearFilters() {
		setSearchInput('')
		replaceParams(
			{ q: null, status: null, date: null, page: null },
			{ resetPage: true }
		)
	}
	return {
		searchInput,
		setSearchInput,
		statusFilter,
		dateFilter,
		perPage,
		replaceParams,
		goToPage,
		clearFilters,
		orders,
		total,
		totalPages,
		currentPage,
		rangeLabel,
		showPager,
		isEmptyStore,
		isPageFetching,
		isLoading,
		isError,
		hasData: Boolean(data),
		refetch,
		selectedId,
		setSelectedId,
		pendingAction,
		setPendingAction,
		statusMutation,
	}
}
