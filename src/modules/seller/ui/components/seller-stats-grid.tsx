import type { SellerStat } from '../../constants'
import { SellerStatCard } from './seller-stat-card'

type SellerStatsGridProps = {
	stats: SellerStat[]
}

export const SellerStatsGrid = ({ stats }: SellerStatsGridProps) => (
	<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
		{stats.map((stat) => (
			<SellerStatCard key={stat.id} stat={stat} />
		))}
	</div>
)
