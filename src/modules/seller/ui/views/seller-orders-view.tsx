'use client'

import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { OrderSkeleton } from '@/modules/orders/ui/components/order-skeleton'
import { formatPrice } from '@/utils/format-price'

type SellerOrder = {
	id: string
	storeName: string
	storeAvatar: string | null
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

const STATUS_OPTIONS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'pending', label: 'Pendentes' },
	{ value: 'shipping', label: 'Envio' },
	{ value: 'completed', label: 'Concluídos' },
	{ value: 'cancelled', label: 'Cancelados' },
]

const DATE_OPTIONS = [
	{ value: 'all', label: 'Todo o período' },
	{ value: '7d', label: 'Últimos 7 dias' },
	{ value: '30d', label: 'Últimos 30 dias' },
	{ value: '90d', label: 'Últimos 90 dias' },
]

export const SellerOrdersView = () => {
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [dateFilter, setDateFilter] = useState('all')

	const { data, isLoading } = useQuery<{ orders: SellerOrder[] }>({
		queryKey: ['seller-orders'],
		queryFn: async () => {
			const res = await fetch('/api/seller/orders')
			if (!res.ok) throw new Error('Failed to load orders')
			return res.json()
		},
	})

	const filtered = useMemo(() => {
		const orders = data?.orders ?? []
		return orders.filter((o) => {
			if (search) {
				const q = search.toLowerCase()
				if (
					!o.id.toLowerCase().includes(q) &&
					!o.storeName.toLowerCase().includes(q)
				)
					return false
			}
			if (statusFilter !== 'all' && o.status !== statusFilter)
				return false
			if (dateFilter !== 'all') {
				const now = Date.now()
				const orderDate = new Date(o.date).getTime()
				const days = Number.parseInt(dateFilter, 10) || 0
				const cutoff = now - days * 24 * 60 * 60 * 1000
				if (orderDate < cutoff) return false
			}
			return true
		})
	}, [data, search, statusFilter, dateFilter])

	if (isLoading) {
		return (
			<div className='space-y-4'>
				{Array.from({ length: 5 }).map((_, i) => (
					<OrderSkeleton key={i} />
				))}
			</div>
		)
	}

	const orders = data?.orders ?? []

	if (orders.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<ShoppingBag className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Nenhum pedido ainda
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					Quando um cliente fizer um pedido na sua loja, ele aparecerá
					aqui.
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative flex-1 min-w-[200px] max-w-sm'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Pesquisar pedidos...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='pl-9 pr-9'
					/>
					{search && (
						<button
							type='button'
							onClick={() => setSearch('')}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
						>
							<X className='size-4' />
						</button>
					)}
				</div>
				<Select
					value={statusFilter}
					onValueChange={(v) => v && setStatusFilter(v)}
				>
					<SelectTrigger className='w-[150px]'>
						<SelectValue placeholder='Estado' />
					</SelectTrigger>
					<SelectContent>
						{STATUS_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={dateFilter}
					onValueChange={(v) => v && setDateFilter(v)}
				>
					<SelectTrigger className='w-[160px]'>
						<SelectValue placeholder='Período' />
					</SelectTrigger>
					<SelectContent>
						{DATE_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<p className='text-sm text-muted-foreground'>
				{filtered.length} {filtered.length === 1 ? 'pedido' : 'pedidos'}
				{filtered.length !== orders.length &&
					` (${orders.length} total)`}
			</p>

			{filtered.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<p className='text-sm text-muted-foreground'>
						Nenhum pedido encontrado com os filtros actuais.
					</p>
				</div>
			) : (
				<div className='space-y-2'>
					{filtered.map((order) => (
						<div
							key={order.id}
							className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4'
						>
							<div className='flex flex-1 flex-col gap-1'>
								<div className='flex items-center gap-2'>
									<span className='font-medium'>
										#{order.id.slice(0, 8)}
									</span>
									<OrderStatusBadge
										status={order.status}
										label={order.statusLabel}
									/>
								</div>
								<p className='text-sm text-muted-foreground'>
									{new Date(order.date).toLocaleDateString(
										'pt-PT'
									)}{' '}
									&middot; {order.itemCount}{' '}
									{order.itemCount === 1 ? 'item' : 'itens'}
								</p>
							</div>
							<div className='text-right'>
								<p className='font-semibold'>
									{formatPrice(order.total, order.currency)}
								</p>
								<p className='text-xs text-muted-foreground'>
									{order.storeName}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
