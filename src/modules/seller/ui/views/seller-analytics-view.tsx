'use client'

import { useQuery } from '@tanstack/react-query'
import {
	BarChart3,
	Eye,
	Package,
	ShoppingBag,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/utils/format-price'

type Range = '7d' | '30d' | '90d'

type AnalyticsData = {
	totalSales: number
	totalOrders: number
	totalViews: number
	totalFollowers: number
	averageTicket: number
	productCount: number
}

const RANGE_LABELS: Record<Range, string> = {
	'7d': '7 dias',
	'30d': '30 dias',
	'90d': '90 dias',
}

const KPI_CARDS = [
	{
		key: 'totalSales',
		icon: TrendingUp,
		label: 'Vendas',
		format: (v: number) => formatPrice(v),
	},
	{
		key: 'totalOrders',
		icon: ShoppingBag,
		label: 'Pedidos',
		format: (v: number) => String(v),
	},
	{
		key: 'averageTicket',
		icon: BarChart3,
		label: 'Ticket médio',
		format: (v: number) => formatPrice(v),
	},
	{
		key: 'totalViews',
		icon: Eye,
		label: 'Visualizações',
		format: (v: number) => String(v),
	},
	{
		key: 'productCount',
		icon: Package,
		label: 'Produtos activos',
		format: (v: number) => String(v),
	},
	{
		key: 'totalFollowers',
		icon: Users,
		label: 'Seguidores',
		format: (v: number) => String(v),
	},
]

export const SellerAnalyticsView = () => {
	const [range, setRange] = useState<Range>('30d')

	const { data, isLoading } = useQuery<AnalyticsData>({
		queryKey: ['seller-analytics', range],
		queryFn: async () => {
			const res = await fetch(
				`/api/seller/stats/analytics?range=${range}`
			)
			if (!res.ok) throw new Error('Failed to load analytics')
			return res.json()
		},
	})

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='font-heading text-xl font-bold'>
						Analytics
					</h1>
					<p className='text-sm text-muted-foreground'>
						Métricas de desempenho da sua loja
					</p>
				</div>
				<div className='flex gap-1 rounded-lg border border-border/60 bg-card p-1'>
					{(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
						<button
							type='button'
							key={r}
							onClick={() => setRange(r)}
							className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
								range === r
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							{RANGE_LABELS[r]}
						</button>
					))}
				</div>
			</div>

			{isLoading ? (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='rounded-xl border border-border/60 bg-card p-5'
						>
							<Skeleton className='mb-2 h-4 w-20' />
							<Skeleton className='h-8 w-28' />
						</div>
					))}
				</div>
			) : (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{KPI_CARDS.map((kpi) => {
						const Icon = kpi.icon
						const value = data
							? kpi.format(data[kpi.key as keyof AnalyticsData])
							: '—'

						return (
							<div
								key={kpi.key}
								className='rounded-xl border border-border/60 bg-card p-5 transition-colors hover:bg-accent/50'
							>
								<div className='flex items-center gap-2 text-sm text-muted-foreground'>
									<Icon className='size-4' />
									<span>{kpi.label}</span>
								</div>
								<p className='mt-2 font-heading text-2xl font-bold'>
									{value}
								</p>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
