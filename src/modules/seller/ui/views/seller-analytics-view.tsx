'use client'

/**
 * THESIS: Period performance at a glance — five honest KPIs + trend strip.
 * Refuses ticket médio (not the Zuka contact-first mental model yet).
 * OWN-WORLD: Seller Operate (rounded-2xl, muted meta, amber-free KPI grid).
 * STORY: Pick period → read what moved → open pedidos/produtos if needed.
 * FIRST VIEWPORT: Title + period + mock notice + KPI grid.
 * FORM: Extension of seller dashboard; mock until views/events are real.
 */

import { useSellerAnalytics } from '@/modules/seller/hooks/use-seller-analytics'
import { SellerAnalyticsKpis } from '@/modules/seller/ui/components/analytics/seller-analytics-kpi-card'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import {
	SellerAnalyticsError,
	SellerAnalyticsSkeleton,
} from '@/modules/seller/ui/sections/seller-analytics-gates'
import { SellerAnalyticsHeader } from '@/modules/seller/ui/sections/seller-analytics-header'
import { SellerAnalyticsTrend } from '@/modules/seller/ui/sections/seller-analytics-trend'

export const SellerAnalyticsView = () => {
	useSetSellerPageMeta({
		title: 'Desempenho',
		crumbs: ['Dashboard', 'Desempenho'],
	})

	const a = useSellerAnalytics()

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<SellerAnalyticsHeader range={a.range} onRangeChange={a.setRange} />

			{a.isLoading ? (
				<SellerAnalyticsSkeleton />
			) : a.isError && !a.data ? (
				<SellerAnalyticsError onRetry={() => a.refetch()} />
			) : a.data ? (
				<>
					<SellerAnalyticsKpis data={a.data} />
					<SellerAnalyticsTrend
						range={a.range}
						dailySales={a.data.dailySales}
						maxDaily={a.maxDaily}
					/>
				</>
			) : null}
		</div>
	)
}
