'use client'

import { useAdminOverview } from '@/modules/admin/hooks/use-admin-overview'
import { AdminOverviewCharts } from '@/modules/admin/ui/sections/admin-overview-charts'
import { AdminOverviewKpis } from '@/modules/admin/ui/sections/admin-overview-kpis'
import { AdminOverviewPending } from '@/modules/admin/ui/sections/admin-overview-pending'

export function AdminOverviewView() {
	const o = useAdminOverview()

	return (
		<div className='space-y-8'>
			<AdminOverviewKpis statsLoading={o.statsLoading} stats={o.stats} />

			<AdminOverviewCharts
				analyticsLoading={o.analyticsLoading}
				signups={o.signups}
				products={o.products}
			/>

			<AdminOverviewPending
				pendingLoading={o.pendingLoading}
				pendingApprovals={o.stats?.pendingApprovals}
				pending={o.pending}
			/>
		</div>
	)
}
