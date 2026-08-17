import { Skeleton } from '@/components/ui/skeleton'

type ProfileStat = {
	label: string
	value: number
	isLoading?: boolean
}
type ProfileStatsProps = {
	stats: ProfileStat[]
}
export const ProfileStats = ({ stats }: ProfileStatsProps) => (
	<div className='pt-10 mb-2 flex gap-4'>
		{stats.map((s) => (
			<div key={s.label} className='flex flex-col items-center'>
				{s.isLoading ? (
					<Skeleton className='h-5 w-8 rounded-md mb-1' />
				) : (
					<span className='text-md font-semibold text-center'>
						{s.value}
					</span>
				)}
				<h2 className='text-sm font-medium text-muted-foreground'>
					{s.label}
				</h2>
			</div>
		))}
	</div>
)
