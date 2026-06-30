import { Eye, Package, TrendingUp, Users } from 'lucide-react'
import type { SellerStat } from '../../constants'

const ICONS = {
	trending: { Icon: TrendingUp, bg: 'bg-rose-100', fg: 'text-rose-500' },
	package: { Icon: Package, bg: 'bg-blue-100', fg: 'text-blue-500' },
	users: { Icon: Users, bg: 'bg-emerald-100', fg: 'text-emerald-500' },
	eye: { Icon: Eye, bg: 'bg-amber-100', fg: 'text-amber-500' },
} as const

type SellerStatCardProps = {
	stat: SellerStat
}

export const SellerStatCard = ({ stat }: SellerStatCardProps) => {
	const { Icon, bg, fg } = ICONS[stat.icon]

	return (
		<div className='rounded-2xl border bg-white p-5'>
			<div
				className={`mb-4 flex size-10 items-center justify-center rounded-full ${bg}`}
			>
				<Icon className={`size-5 ${fg}`} />
			</div>

			<p className='text-2xl font-bold'>{stat.value}</p>
			<p className='text-sm text-muted-foreground'>{stat.label}</p>
		</div>
	)
}
