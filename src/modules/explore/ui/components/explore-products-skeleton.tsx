import { Skeleton } from '@/components/ui/skeleton'

export const ExploreProductsSkeleton = () => (
	<div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
		{Array.from({ length: 8 }).map((_, i) => (
			<div key={i} className='space-y-2'>
				<Skeleton className='aspect-4/5 w-full rounded-2xl' />
				<Skeleton className='h-4 w-full rounded-md' />
				<Skeleton className='h-4 w-1/2 rounded-md' />
			</div>
		))}
	</div>
)
