'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { KpiCard } from '@/modules/admin/ui/components/kpi-card'

type AdminOverviewKpisProps = {
	statsLoading: boolean
	stats?: {
		totalUsers?: number
		totalUsersPct?: number
		activeStores?: number
		activeStoresPct?: number
		pendingApprovals?: number
		totalProducts?: number
		totalProductsPct?: number
		messagesToday?: number
	}
}

export function AdminOverviewKpis({
	statsLoading,
	stats,
}: AdminOverviewKpisProps) {
	return (
		<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
			{statsLoading ? (
				Array.from({ length: 5 }, (_, i) => (
					<Skeleton key={i} className='h-28 rounded-2xl' />
				))
			) : (
				<>
					<KpiCard
						label='Total utilizadores'
						value={stats?.totalUsers ?? 0}
						pct={stats?.totalUsersPct}
					/>
					<KpiCard
						label='Lojas ativas'
						value={stats?.activeStores ?? 0}
						pct={stats?.activeStoresPct}
					/>
					<KpiCard
						label='Aprovações pendentes'
						value={stats?.pendingApprovals ?? 0}
					/>
					<KpiCard
						label='Produtos listados'
						value={stats?.totalProducts ?? 0}
						pct={stats?.totalProductsPct}
					/>
					<KpiCard
						label='Mensagens hoje'
						value={stats?.messagesToday ?? 0}
					/>
				</>
			)}
		</div>
	)
}
