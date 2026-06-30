import { Skeleton } from '@/components/ui/skeleton'

export const ExploreStoresSkeleton = () => (
	<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
		{Array.from({ length: 6 }).map((_, i) => (
			<div
				key={i}
				className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4'
			>
				<Skeleton className='size-16 shrink-0 rounded-xl' />
				<div className='flex-1 space-y-2'>
					<Skeleton className='h-4 w-2/3 rounded-md' />
					<Skeleton className='h-3 w-full rounded-md' />
					<Skeleton className='h-3 w-1/2 rounded-md' />
				</div>
			</div>
		))}
	</div>
)
