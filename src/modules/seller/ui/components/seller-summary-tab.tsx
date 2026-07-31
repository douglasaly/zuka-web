'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Area, AreaChart, XAxis } from 'recharts'
import { ArrowUpRight } from 'lucide-react'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatPrice } from '@/utils/format-price'

type DailySale = { date: string; sales: number }
type TopProduct = {
	id: string
	name: string
	quantity: number
	revenue: number
	currency: string
}
type DashboardOrder = {
	id: string
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

const RANGE_OPTIONS = [
	{ value: 7, label: '7d' },
	{ value: 14, label: '14d' },
	{ value: 30, label: '30d' },
] as const

const chartConfig = {
	sales: {
		label: 'Vendas',
		color: 'var(--color-neutral-900)',
	},
} satisfies ChartConfig

const formatShortDate = (date: string) => {
	const d = new Date(date)
	return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
}

export const SellerSummaryTab = () => {
	const [range, setRange] = useState(7)

	const { data: dailyData } = useQuery<{ data: DailySale[] }>({
		queryKey: ['seller-daily-sales', range],
		queryFn: () =>
			fetch(`/api/seller/stats/daily?days=${range}`).then((r) => r.json()),
	})

	const { data: topProductsData } = useQuery<{ data: TopProduct[] }>({
		queryKey: ['seller-top-products'],
		queryFn: () =>
			fetch('/api/seller/stats/top-products?limit=5').then((r) =>
				r.json()
			),
	})

	const { data: ordersData } = useQuery<{ orders: DashboardOrder[] }>({
		queryKey: ['seller-dashboard-orders'],
		queryFn: () =>
			fetch('/api/seller/orders?limit=5').then((r) => r.json()),
	})

	const dailySales = dailyData?.data ?? []
	const topProducts = topProductsData?.data ?? []
	const latestOrders = ordersData?.orders ?? []

	return (
		<div className='space-y-6'>
			<div className='rounded-2xl border bg-white p-5'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<h3 className='text-sm font-semibold'>Vendas</h3>
						<div className='flex rounded-lg bg-muted p-0.5'>
							{RANGE_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type='button'
									onClick={() => setRange(opt.value)}
									className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
										range === opt.value
											? 'bg-white text-foreground shadow-sm'
											: 'text-muted-foreground hover:text-foreground'
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>
				</div>

				{dailySales.length > 0 ? (
					<ChartContainer
						config={chartConfig}
						className='h-[160px] w-full'
					>
						<AreaChart
							data={dailySales}
							margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient
									id='fillSales'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='0%'
										stopColor='var(--color-neutral-900)'
										stopOpacity={0.15}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-neutral-900)'
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey='date'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={formatShortDate}
								fontSize={11}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										indicator='dot'
										formatter={(value) =>
											formatPrice(value as number, 'MZN')
										}
									/>
								}
							/>
							<Area
								type='monotone'
								dataKey='sales'
								stroke='var(--color-neutral-900)'
								strokeWidth={2}
								fill='url(#fillSales)'
							/>
						</AreaChart>
					</ChartContainer>
				) : (
					<p className='py-8 text-center text-sm text-muted-foreground'>
						Sem dados de vendas
					</p>
				)}
			</div>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<div className='rounded-2xl border bg-white p-5'>
					<div className='mb-4 flex items-center justify-between'>
						<h3 className='text-sm font-semibold'>
							Produtos mais vendidos
						</h3>
						<Link
							href='/dashboard/seller/produtos'
							className='flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground'
						>
							Ver todos
							<ArrowUpRight className='size-3' />
						</Link>
					</div>

					{topProducts.length === 0 ? (
						<p className='py-4 text-center text-sm text-muted-foreground'>
							Sem vendas ainda
						</p>
					) : (
						<div className='space-y-3'>
							{topProducts.map((p, i) => (
								<div
									key={p.id}
									className='flex items-center gap-3'
								>
									<span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium'>
										{i + 1}
									</span>
									<div className='min-w-0 flex-1'>
										<p className='truncate text-sm font-medium'>
											{p.name}
										</p>
										<p className='text-xs text-muted-foreground'>
											{p.quantity} vendidos
										</p>
									</div>
									<p className='shrink-0 text-sm font-semibold'>
										{formatPrice(p.revenue, p.currency)}
									</p>
								</div>
							))}
						</div>
					)}
				</div>

				<div className='rounded-2xl border bg-white p-5'>
					<div className='mb-4 flex items-center justify-between'>
						<h3 className='text-sm font-semibold'>
							Últimos pedidos
						</h3>
						<Link
							href='/dashboard/seller/pedidos'
							className='flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground'
						>
							Ver todos
							<ArrowUpRight className='size-3' />
						</Link>
					</div>

					{latestOrders.length === 0 ? (
						<p className='py-4 text-center text-sm text-muted-foreground'>
							Nenhum pedido ainda
						</p>
					) : (
						<div className='space-y-3'>
							{latestOrders.map((order) => (
								<div
									key={order.id}
									className='flex items-center justify-between'
								>
									<div className='min-w-0 flex-1'>
										<div className='flex items-center gap-2'>
											<span className='text-sm font-medium'>
												#{order.id.slice(0, 8)}
											</span>
											<OrderStatusBadge
												status={order.status}
												label={order.statusLabel}
											/>
										</div>
										<p className='text-xs text-muted-foreground'>
											{new Date(
												order.date
											).toLocaleDateString('pt-PT')}
										</p>
									</div>
									<p className='shrink-0 text-sm font-semibold'>
										{formatPrice(order.total, order.currency)}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
