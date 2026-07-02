import { Skeleton } from '@/components/ui/skeleton'

const GROUPS = [
	{ label: 'Hoje', count: 3 },
	{ label: 'Ontem', count: 2 },
]

export const NotificationsPageSkeleton = () => (
	<div className='space-y-8'>
		{GROUPS.map((g) => (
			<div key={g.label} className='space-y-2'>
				<div className='flex items-center gap-3 px-1'>
					<Skeleton className='h-2.5 w-10 rounded-md' />
					<div className='h-px flex-1 bg-border/40' />
				</div>

				<div className='overflow-hidden rounded-2xl border border-border/60 shadow-sm'>
					{Array.from({ length: g.count }).map((_, i) => (
						<div
							key={i}
							className='flex items-start gap-4 border-b border-border/40 border-l-[3px] border-l-transparent bg-white px-5 py-4 last:border-b-0'
						>
							<Skeleton className='mt-0.5 size-10 shrink-0 rounded-full' />
							<div className='flex-1 space-y-2.5'>
								<div className='flex items-start justify-between gap-3'>
									<Skeleton className='h-3.5 w-2/5 rounded-md' />
									<Skeleton className='h-3 w-14 rounded-md' />
								</div>
								<Skeleton className='h-3 w-full rounded-md' />
								<Skeleton className='h-3 w-3/4 rounded-md' />
								<Skeleton className='h-5 w-20 rounded-full' />
							</div>
						</div>
					))}
				</div>
			</div>
		))}
	</div>
)
