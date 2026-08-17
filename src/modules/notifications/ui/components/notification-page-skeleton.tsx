import { Skeleton } from '@/components/ui/skeleton'

const GROUPS = [
	{ label: 'Hoje', count: 3 },
	{ label: 'Ontem', count: 2 },
]
export const NotificationsPageSkeleton = () => (
	<div className='space-y-6'>
		<Skeleton className='h-4 w-28 rounded-md' />

		{GROUPS.map((group) => (
			<div key={group.label} className='space-y-2'>
				<div className='flex items-center gap-3 px-1'>
					<Skeleton className='h-2.5 w-10 rounded-md' />
					<div className='h-px flex-1 bg-border/40' />
				</div>

				<div className='divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/60 shadow-sm'>
					{Array.from({ length: group.count }).map((_, index) => (
						<div key={index} className='px-4 py-3.5 sm:px-5'>
							<div className='flex flex-col gap-2.5 xl:flex-row xl:items-center xl:gap-6'>
								<div className='flex min-w-0 items-start gap-3 xl:flex-1'>
									<Skeleton className='size-10 shrink-0 rounded-full' />
									<div className='flex-1 space-y-2.5'>
										<Skeleton className='h-3.5 w-2/5 rounded-md' />
										<Skeleton className='h-3 w-full max-w-prose rounded-md' />
										<div className='flex items-center gap-2'>
											<Skeleton className='h-5 w-20 rounded-full' />
											<Skeleton className='h-3 w-16 rounded-md' />
										</div>
									</div>
								</div>

								<div className='flex items-center gap-1 pl-13 xl:shrink-0 xl:pl-0'>
									<Skeleton className='h-9 w-28 rounded-full' />
									<div className='ml-auto flex gap-1'>
										<Skeleton className='size-9 rounded-full' />
										<Skeleton className='size-9 rounded-full' />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		))}
	</div>
)
