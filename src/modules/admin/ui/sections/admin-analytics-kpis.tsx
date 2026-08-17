'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { KpiCard } from '@/modules/admin/ui/components/kpi-card'

type AdminAnalyticsKpisProps = {
	statsLoading: boolean
	totalUsers: number
	activeStores: number
	totalProducts: number
	approvalRate: number
}
export function AdminAnalyticsKpis({
	statsLoading,
	totalUsers,
	activeStores,
	totalProducts,
	approvalRate,
}: AdminAnalyticsKpisProps) {
	return (
		<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
			{statsLoading ? (
				Array.from({ length: 4 }, (_, i) => (
					<Skeleton key={i} className='h-28 rounded-2xl' />
				))
			) : (
				<>
					<KpiCard label='Total utilizadores' value={totalUsers} />
					<KpiCard label='Lojas ativas' value={activeStores} />
					<KpiCard label='Produtos listados' value={totalProducts} />
					<KpiCard
						label='Taxa de aprovação'
						value={`${approvalRate}%`}
					/>
				</>
			)}
		</div>
	)
}
