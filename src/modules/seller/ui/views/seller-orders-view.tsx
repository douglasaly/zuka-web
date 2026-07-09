'use client'

import { useQuery } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
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

export const SellerOrdersView = () => {
	const { data, isLoading } = useQuery<{ orders: SellerOrder[] }>({
		queryKey: ['seller-orders'],
		queryFn: async () => {
			const res = await fetch('/api/seller/orders')
			if (!res.ok) throw new Error('Failed to load orders')
			return res.json()
		},
	})

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
			{orders.map((order) => (
				<div
					key={order.id}
					className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4'
				>
					<div className='flex flex-1 flex-col gap-1'>
						<div className='flex items-center gap-2'>
							<span className='font-medium'>
								#{order.id.slice(0, 8)}
							</span>
							<OrderStatusBadge status={order.status} />
						</div>
						<p className='text-sm text-muted-foreground'>
							{new Date(order.date).toLocaleDateString('pt-PT')}{' '}
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
	)
}
