'use client'
import { RANGE_OPTIONS } from '@/modules/seller/ui/components/analytics/constants'
import type {
	AnalyticsRange,
	SellerAnalyticsMock,
} from '@/modules/seller/ui/components/analytics/mock-data'
import { formatPrice } from '@/utils/format-price'

type SellerAnalyticsTrendProps = {
	range: AnalyticsRange
	dailySales: SellerAnalyticsMock['dailySales']
	maxDaily: number
}
export function SellerAnalyticsTrend({
	range,
	dailySales,
	maxDaily,
}: SellerAnalyticsTrendProps) {
	return (
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
				{RANGE_OPTIONS.find((o) => o.value === range)?.label ?? range}
				).
			</p>
			<ul className='mt-5 space-y-2.5'>
				{dailySales.map((point) => {
					const pct = Math.round((point.sales / maxDaily) * 100)
					const label = new Date(point.date).toLocaleDateString(
						'pt-PT',
						{
							day: 'numeric',
							month: 'short',
						}
					)
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
	)
}
