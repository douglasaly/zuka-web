'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	formatChange,
	KPI_CARDS,
} from '@/modules/seller/ui/components/analytics/constants'
import type { SellerAnalyticsMock } from '@/modules/seller/ui/components/analytics/mock-data'

type SellerAnalyticsKpiCardProps = {
	kpi: (typeof KPI_CARDS)[number]
	value: number
	change: number
}

export function SellerAnalyticsKpiCard({
	kpi,
	value,
	change,
}: SellerAnalyticsKpiCardProps) {
	const Icon = kpi.icon
	const up = change > 0
	const down = change < 0

	return (
		<article className='rounded-2xl border border-border/60 bg-card p-4 sm:p-5'>
			<div className='flex items-center gap-2 text-sm text-muted-foreground'>
				<Icon className='size-4 shrink-0' aria-hidden />
				<span>{kpi.label}</span>
			</div>
			<p className='mt-2 font-heading text-2xl font-bold tabular-nums tracking-tight'>
				{kpi.format(value)}
			</p>
			<p className='mt-1 text-xs text-muted-foreground'>{kpi.hint}</p>
			<p
				className={cn(
					'mt-3 flex items-center gap-1 text-xs font-medium tabular-nums',
					up && 'text-emerald-700 dark:text-emerald-400',
					down && 'text-red-700 dark:text-red-400',
					!up && !down && 'text-muted-foreground'
				)}
			>
				{up ? <TrendingUp className='size-3.5' aria-hidden /> : null}
				{down ? (
					<TrendingDown className='size-3.5' aria-hidden />
				) : null}
				<span>{formatChange(change)} vs período anterior</span>
			</p>
		</article>
	)
}

type SellerAnalyticsKpisProps = {
	data: SellerAnalyticsMock
}

export function SellerAnalyticsKpis({ data }: SellerAnalyticsKpisProps) {
	return (
		<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
			{KPI_CARDS.map((kpi) => (
				<SellerAnalyticsKpiCard
					key={kpi.key}
					kpi={kpi}
					value={data[kpi.key]}
					change={data.changes[kpi.key]}
				/>
			))}
		</div>
	)
}
