'use client'

import { Package } from 'lucide-react'
import Link from 'next/link'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatPrice } from '@/utils/format-price'
import type { DashboardOrder } from '../../hooks/use-seller-dashboard'
import { SellerEmptyState } from '../components/seller-empty-state'

interface Props {
	orders: DashboardOrder[]
}

export function SellerOrdersSection({ orders }: Props) {
	if (orders.length === 0) {
		return (
			<SellerEmptyState
				icon={Package}
				title='Nenhum pedido ainda'
				description='Quando receber pedidos, eles aparecerão aqui.'
				cta={{
					label: 'Ver produtos',
					href: '/dashboard/seller/produtos',
				}}
			/>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
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
						<p className='font-semibold'>
							{formatPrice(order.total, order.currency)}
						</p>
					</div>
				))}
			</div>
			<Link
				href='/dashboard/seller/pedidos'
				className='block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
			>
				Ver todos os pedidos
			</Link>
		</div>
	)
}
