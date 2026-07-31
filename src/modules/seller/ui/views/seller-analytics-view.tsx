'use client'

/**
 * THESIS: Period performance at a glance — five honest KPIs + trend strip.
 * Refuses ticket médio (not the Zuka contact-first mental model yet).
 * OWN-WORLD: Seller Operate (rounded-2xl, muted meta, amber-free KPI grid).
 * STORY: Pick period → read what moved → open pedidos/produtos if needed.
 * FIRST VIEWPORT: Title + period + mock notice + KPI grid.
 * FORM: Extension of seller dashboard; mock until views/events are real.
 */

import { useQuery } from '@tanstack/react-query'
import {
	Eye,
	Package,
	ShoppingBag,
	TrendingDown,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import { formatPrice } from '@/utils/format-price'
import {
	type AnalyticsRange,
	type SellerAnalyticsMock,
	getMockSellerAnalytics,
} from '../components/analytics/mock-data'

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
	{ value: '7d', label: '7 dias' },
	{ value: '30d', label: '30 dias' },
	{ value: '90d', label: '90 dias' },
]

type KpiKey = keyof Omit<SellerAnalyticsMock, 'changes' | 'dailySales'>

const KPI_CARDS: Array<{
	key: KpiKey
	icon: typeof TrendingUp
	label: string
	hint: string
	format: (v: number) => string
}> = [
	{
		key: 'totalSales',
		icon: TrendingUp,
		label: 'Vendas',
		hint: 'Valor dos pedidos no período',
		format: (v) => formatPrice(v),
	},
	{
		key: 'totalOrders',
		icon: ShoppingBag,
		label: 'Pedidos',
		hint: 'Pedidos recebidos no período',
		format: (v) => String(v),
	},
	{
		key: 'totalViews',
		icon: Eye,
		label: 'Vistas',
		hint: 'Vistas da loja e produtos',
		format: (v) => v.toLocaleString('pt-MZ'),
	},
	{
		key: 'productCount',
		icon: Package,
		label: 'Produtos activos',
		hint: 'À venda agora',
		format: (v) => String(v),
	},
	{
		key: 'totalFollowers',
		icon: Users,
		label: 'Seguidores',
		hint: 'Pessoas a seguir a loja',
		format: (v) => v.toLocaleString('pt-MZ'),
	},
]

function formatChange(pct: number): string {
	const abs = Math.abs(pct).toFixed(1).replace('.', ',')
	if (pct > 0) return `+${abs}%`
	if (pct < 0) return `−${abs}%`
	return '0%'
}

async function fetchAnalytics(
	range: AnalyticsRange
): Promise<SellerAnalyticsMock> {
	const res = await fetch(`/api/seller/stats/analytics?range=${range}`)
	if (!res.ok) {
		// Fallback local mock if API fails during development
		return getMockSellerAnalytics(range)
	}
	const json = await res.json()
	return (json.data ?? json) as SellerAnalyticsMock
}

export const SellerAnalyticsView = () => {
	useSetSellerPageMeta({
		title: 'Desempenho',
		crumbs: ['Dashboard', 'Desempenho'],
	})

	const [range, setRange] = useState<AnalyticsRange>('30d')

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['seller-analytics', range],
		queryFn: () => fetchAnalytics(range),
	})

	const maxDaily = Math.max(
		...(data?.dailySales.map((d) => d.sales) ?? [1]),
		1
	)

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div className='min-w-0'>
					<p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
						Como a loja correu no período escolhido — vendas,
						pedidos, vistas e interesse.
					</p>
				</div>
				<div
					className='flex gap-1.5 self-start rounded-full border border-border/60 bg-card p-1'
					role='group'
					aria-label='Período'
				>
					{RANGE_OPTIONS.map((opt) => (
						<button
							type='button'
							key={opt.value}
							aria-pressed={range === opt.value}
							onClick={() => setRange(opt.value)}
							className={cn(
								'h-10 shrink-0 rounded-full px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
								range === opt.value
									? 'bg-foreground text-background'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>

			<p
				className='rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground'
				role='status'
			>
				Dados de exemplo para pré-visualizar o ecrã. As métricas reais
				ligam-se quando o rastreio de vistas estiver activo.
			</p>

			{isLoading ? (
				<AnalyticsSkeleton />
			) : isError && !data ? (
				<div className='flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center'>
					<h2 className='font-heading text-lg font-bold'>
						Não foi possível carregar o desempenho
					</h2>
					<p className='mt-1.5 max-w-md text-sm text-muted-foreground'>
						Verifica a ligação e tenta outra vez.
					</p>
					<button
						type='button'
						onClick={() => refetch()}
						className='mt-6 h-10 rounded-full bg-foreground px-4 text-sm font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
					>
						Tentar novamente
					</button>
				</div>
			) : data ? (
				<>
					<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
						{KPI_CARDS.map((kpi) => {
							const Icon = kpi.icon
							const change = data.changes[kpi.key]
							const up = change > 0
							const down = change < 0
							return (
								<article
									key={kpi.key}
									className='rounded-2xl border border-border/60 bg-card p-4 sm:p-5'
								>
									<div className='flex items-center gap-2 text-sm text-muted-foreground'>
										<Icon
											className='size-4 shrink-0'
											aria-hidden
										/>
										<span>{kpi.label}</span>
									</div>
									<p className='mt-2 font-heading text-2xl font-bold tabular-nums tracking-tight'>
										{kpi.format(data[kpi.key])}
									</p>
									<p className='mt-1 text-xs text-muted-foreground'>
										{kpi.hint}
									</p>
									<p
										className={cn(
											'mt-3 flex items-center gap-1 text-xs font-medium tabular-nums',
											up && 'text-emerald-700 dark:text-emerald-400',
											down && 'text-red-700 dark:text-red-400',
											!up &&
												!down &&
												'text-muted-foreground'
										)}
									>
										{up ? (
											<TrendingUp
												className='size-3.5'
												aria-hidden
											/>
										) : null}
										{down ? (
											<TrendingDown
												className='size-3.5'
												aria-hidden
											/>
										) : null}
										<span>
											{formatChange(change)} vs período
											anterior
										</span>
									</p>
								</article>
							)
						})}
					</div>

					<section
						aria-labelledby='sales-trend-heading'
						className='rounded-2xl border border-border/60 bg-card p-4 sm:p-5'
					>
						<h2
							id='sales-trend-heading'
							className='font-heading text-base font-semibold'
						>
							Vendas ao longo do tempo
						</h2>
						<p className='mt-1 text-sm text-muted-foreground'>
							Valor estimado por ponto do período (
							{RANGE_OPTIONS.find((o) => o.value === range)
								?.label ?? range}
							).
						</p>
						<ul className='mt-5 space-y-2.5'>
							{data.dailySales.map((point) => {
								const pct = Math.round(
									(point.sales / maxDaily) * 100
								)
								const label = new Date(
									point.date
								).toLocaleDateString('pt-PT', {
									day: 'numeric',
									month: 'short',
								})
								return (
									<li
										key={point.date}
										className='flex items-center gap-3'
									>
										<span className='w-14 shrink-0 text-xs tabular-nums text-muted-foreground'>
											{label}
										</span>
										<span
											className='relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted'
											aria-hidden
										>
											<span
												className='absolute inset-y-0 left-0 rounded-full bg-foreground/80 transition-[width] duration-300 ease-out'
												style={{ width: `${pct}%` }}
											/>
										</span>
										<span className='w-24 shrink-0 text-right text-xs font-medium tabular-nums'>
											{formatPrice(point.sales)}
										</span>
									</li>
								)
							})}
						</ul>
					</section>
				</>
			) : null}
		</div>
	)
}

function AnalyticsSkeleton() {
	return (
		<div
			className='space-y-4'
			aria-busy='true'
			aria-label='A carregar desempenho'
		>
			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='rounded-2xl border border-border/60 bg-card p-5'
					>
						<Skeleton className='mb-2 h-4 w-24' />
						<Skeleton className='h-8 w-28' />
						<Skeleton className='mt-2 h-3 w-32' />
					</div>
				))}
			</div>
			<Skeleton className='h-48 w-full rounded-2xl' />
		</div>
	)
}
