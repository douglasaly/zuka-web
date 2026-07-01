'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { fetchOrders, STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import type { OrderSummary } from '@/types/marketplace'
import { formatPrice } from '@/utils/format-price'
import { cn } from '@/lib/utils'

const tabs = [
	{
		value: 'active',
		label: 'Ativos',
		statuses: ['shipping', 'pending'] as const,
	},
	{
		value: 'completed',
		label: 'Concluídos',
		statuses: ['completed'] as const,
	},
	{
		value: 'cancelled',
		label: 'Cancelados',
		statuses: ['cancelled'] as const,
	},
]

function OrderCard({ order }: { order: OrderSummary }) {
	return (
		<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
			<div className='flex items-center gap-3 p-4'>
				<div className='relative size-11 shrink-0 overflow-hidden rounded-full'>
					<Image
						src={order.storeAvatar ?? STORE_PLACEHOLDER}
						alt={order.storeName}
						fill
						className='object-cover'
					/>
				</div>
				<div className='min-w-0 flex-1'>
					<p className='truncate font-semibold text-foreground'>
						{order.storeName}
					</p>
					<p className='text-sm text-muted-foreground'>
						{order.date} · {order.itemCount} ite
						{order.itemCount !== 1 ? 'ns' : 'm'}
					</p>
				</div>
				<OrderStatusBadge
					status={order.status}
					label={order.statusLabel}
				/>
			</div>

			<div className='flex items-center justify-between border-t border-border/60 px-4 py-3'>
				<span className='font-bold text-foreground'>
					{formatPrice(order.total, order.currency)}
				</span>
				<Link
					href={`/feed/pedidos/${order.id}`}
					className='flex items-center gap-1 text-sm font-medium text-secondary hover:underline'
				>
					Ver detalhes
					<ArrowRight className='size-3.5' />
				</Link>
			</div>
		</div>
	)
}

export const OrdersView = () => {
	const [activeTab, setActiveTab] = useState('active')

	const { data: orders = [], isLoading } = useQuery({
		queryKey: ['orders'],
		queryFn: fetchOrders,
		retry: false,
	})

	const currentTab = tabs.find((t) => t.value === activeTab)!
	const filtered = orders.filter((o) =>
		(currentTab.statuses as readonly string[]).includes(o.status)
	)

	return (
		<div className='mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8'>
			<h1 className='mb-6 font-heading text-2xl font-bold tracking-tight md:text-3xl'>
				Os meus pedidos
			</h1>

			<div className='mb-6 flex gap-6 border-b border-border/60'>
				{tabs.map((tab) => (
					<button
						key={tab.value}
						type='button'
						onClick={() => setActiveTab(tab.value)}
						className={cn(
							'pb-3 text-sm font-medium transition-colors',
							activeTab === tab.value
								? 'border-b-2 border-primary text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='space-y-3'>
				{isLoading ? (
					<p className='py-12 text-center text-sm text-muted-foreground'>
						A carregar pedidos...
					</p>
				) : filtered.length === 0 ? (
					<p className='py-12 text-center text-sm text-muted-foreground'>
						Nenhum pedido.
					</p>
				) : (
					filtered.map((order) => (
						<OrderCard key={order.id} order={order} />
					))
				)}
			</div>
		</div>
	)
}
