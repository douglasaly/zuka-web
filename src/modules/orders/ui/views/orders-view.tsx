'use client'

import { PackageOpen, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { flattenPages, useInfiniteList } from '@/hooks/use-infinite-list'
import type {
	BuyerOrder,
	PeriodFilter,
	StatusFilter,
} from '@/modules/orders/types'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import { OrderCard } from '../components/order-card'
import { OrderSkeleton } from '../components/order-skeleton'
import { OrdersAside } from '../components/orders-aside'
import { OrdersToolbar } from '../components/orders-toolbar'

const PAGE_SIZE = 5

type OrdersPage = {
	success: boolean
	data: BuyerOrder[]
	pagination: {
		hasMore: boolean
		nextCursor: string | null
		limit: number
	}
	counts?: Record<StatusFilter, number> & { reviewEligible?: number }
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

export const OrdersView = () => {
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
		queryKey: ['orders', status, period, store],
		endpoint: '/api/orders',
		limit: PAGE_SIZE,
		extraParams,
	})

	const pages = data as { pages: OrdersPage[] } | undefined
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

	return (
		<div className='mx-auto w-full max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:py-8'>
			<header className='mb-5 sm:mb-6'>
				<h1 className='font-heading text-2xl font-bold tracking-tight md:text-3xl'>
					Meus pedidos
				</h1>
				<p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
					Acompanha o estado das tuas compras, fala com a loja e
					avalia quando o pedido for entregue.
				</p>
			</header>

			<div className='mb-5 sm:mb-6'>
				<OrdersToolbar
					search={search}
					onSearchChange={setSearch}
					status={status}
					onStatusChange={setStatus}
					statusCounts={statusCounts}
					showCounts={!isLoading && !isError && statusCounts.all > 0}
					period={period}
					onPeriodChange={setPeriod}
					store={store}
					onStoreChange={setStore}
					stores={stores}
				/>
			</div>

			{isLoading ? (
				<div aria-busy='true' aria-label='A carregar pedidos'>
					<OrderSkeleton />
				</div>
			) : isError ? (
				<div className='flex flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card py-12 text-center'>
					<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
						<RefreshCw className='size-6 text-muted-foreground' />
					</div>
					<div>
						<p className='text-sm font-medium'>
							Não foi possível carregar os pedidos
						</p>
						<p className='mt-1 text-xs text-muted-foreground'>
							Verifica a ligação e tenta outra vez.
						</p>
					</div>
					<Button
						variant='outline'
						className='min-h-11 rounded-full'
						disabled={isFetching}
						onClick={() => refetch()}
					>
						{isFetching ? 'A tentar…' : 'Tentar novamente'}
					</Button>
				</div>
			) : (
				<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
					<div className='order-2 min-w-0 flex-1 lg:order-1'>
						{isEmptyAll ? (
							<EmptyState
								icon={PackageOpen}
								title='Ainda não fizeste nenhum pedido'
								description='Explora produtos e contacta lojas para começar. Os teus pedidos aparecem aqui.'
								className='py-16'
								action={
									<Button
										className='min-h-11 rounded-full px-5'
										render={
											<Link href='/feed/explorar' />
										}
									>
										Explorar produtos
									</Button>
								}
							/>
						) : filtered.length === 0 ? (
							<EmptyState
								icon={PackageOpen}
								title='Nenhum pedido encontrado'
								description='Ajusta a pesquisa ou os filtros para ver outros resultados.'
								className='py-14'
								action={
									hasFilters ? (
										<Button
											variant='outline'
											className='min-h-11 rounded-full'
											onClick={clearFilters}
										>
											Limpar filtros
										</Button>
									) : null
								}
							/>
						) : (
							<div className='space-y-3'>
								<p
									className='text-sm text-muted-foreground'
									aria-live='polite'
								>
									{filtered.length}{' '}
									{filtered.length === 1
										? 'pedido'
										: 'pedidos'}
								</p>
								<ul className='grid gap-3'>
									{filtered.map((order) => (
										<li key={order.id}>
											<OrderCard order={order} />
										</li>
									))}
								</ul>

								{hasNextPage ? (
									<div className='flex justify-center pt-2'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => void fetchNextPage()}
											disabled={isFetchingNextPage}
											className='min-h-10 text-sm text-secondary hover:text-secondary/80'
										>
											{isFetchingNextPage
												? 'A carregar pedidos...'
												: 'Carregar mais pedidos'}
										</Button>
									</div>
								) : null}
							</div>
						)}
					</div>

					{showAside ? (
						<OrdersAside
							className='order-1 lg:order-2'
							pendingReviews={pendingReviews}
							pendingReviewCount={pendingReviewCount}
							recentOrder={recentOrder}
							statusCounts={statusCounts}
							onStatusChange={setStatus}
						/>
					) : null}
				</div>
			)}
		</div>
	)
}
