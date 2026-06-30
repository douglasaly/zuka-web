import { Skeleton } from '@/components/ui/skeleton'

export const FeaturedStoresSkeleton = () => (
	<div className='flex gap-4 overflow-x-hidden py-1 sm:gap-5'>
		{Array.from({ length: 6 }).map((_, i) => (
			<div
				key={i}
				className='flex w-22 shrink-0 flex-col items-center sm:w-24'
			>
				<Skeleton className='size-16 shrink-0 rounded-full sm:size-18' />
				<Skeleton className='mt-2.5 h-3.5 w-16 rounded-md' />
				<Skeleton className='mt-1.5 h-2.5 w-20 rounded-md' />
			</div>
		))}
	</div>
)
