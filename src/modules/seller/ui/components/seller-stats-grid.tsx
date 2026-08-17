import { SellerStatCard, type SellerStatData } from './seller-stat-card'

type SellerStatsGridProps = {
	stats: SellerStatData[]
}
export const SellerStatsGrid = ({ stats }: SellerStatsGridProps) => (
	<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
		{stats.map((stat) => (
			<SellerStatCard key={stat.id} stat={stat} />
		))}
	</div>
)
