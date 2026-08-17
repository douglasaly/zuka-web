'use client'
import { useAdminAnalytics } from '@/modules/admin/hooks/use-admin-analytics'
import { AdminAnalyticsCharts } from '@/modules/admin/ui/sections/admin-analytics-charts'
import { AdminAnalyticsKpis } from '@/modules/admin/ui/sections/admin-analytics-kpis'
import { AdminAnalyticsRange } from '@/modules/admin/ui/sections/admin-analytics-range'
export function AnalyticsView() {
	const a = useAdminAnalytics()
	return (
		<div className='space-y-8'>
			<AdminAnalyticsRange days={a.days} onDaysChange={a.setDays} />

			<AdminAnalyticsKpis
				statsLoading={a.statsLoading}
				totalUsers={a.stats?.totalUsers ?? 0}
				activeStores={a.stats?.activeStores ?? 0}
				totalProducts={a.stats?.totalProducts ?? 0}
				approvalRate={a.approvalRate}
			/>

			<AdminAnalyticsCharts
				days={a.days}
				isLoading={a.isLoading}
				signups={a.signups}
				products={a.products}
				stores={a.stores}
				topStores={a.topStores}
			/>
		</div>
	)
}
