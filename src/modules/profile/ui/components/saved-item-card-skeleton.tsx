import { Skeleton } from '@/components/ui/skeleton'

export const SavedItemCardSkeleton = () => (
	<div className='w-40 shrink-0 overflow-hidden rounded-xl border bg-white sm:w-44'>
		<Skeleton className='aspect-square w-full rounded-none' />

		<div className='space-y-1.5 p-3'>
			<Skeleton className='h-3.5 w-full rounded-md' />
			<Skeleton className='h-3 w-2/3 rounded-md' />
			<Skeleton className='mt-1 h-4 w-1/2 rounded-md' />
		</div>
	</div>
)
