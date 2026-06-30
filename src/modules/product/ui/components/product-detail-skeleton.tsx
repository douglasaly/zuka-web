import { Skeleton } from '@/components/ui/skeleton'

export const ProductDetailSkeleton = () => (
	<div className='mx-auto max-w-4xl pb-10'>
		<Skeleton className='mx-auto aspect-square w-full max-w-xl md:rounded-2xl' />

		<div className='mx-auto mt-4 flex max-w-2xl gap-3 px-4 md:px-0'>
			{Array.from({ length: 4 }).map((_, i) => (
				<Skeleton key={i} className='h-20 w-20 shrink-0 rounded-xl' />
			))}
		</div>

		<div className='space-y-5 px-4 pt-5 md:px-0'>
			<Skeleton className='h-7 w-3/4 rounded-md' />
			<Skeleton className='h-8 w-32 rounded-md' />
			<Skeleton className='h-20 w-full rounded-2xl' />

			<div className='space-y-2'>
				<Skeleton className='h-5 w-24 rounded-md' />
				<Skeleton className='h-4 w-full rounded-md' />
				<Skeleton className='h-4 w-5/6 rounded-md' />
			</div>

			<div className='flex gap-2'>
				<Skeleton className='h-12 flex-1 rounded-xl' />
				<Skeleton className='h-12 w-24 rounded-xl' />
				<Skeleton className='h-12 w-24 rounded-xl' />
			</div>
		</div>
	</div>
)
