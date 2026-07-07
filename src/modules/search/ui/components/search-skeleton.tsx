import { Skeleton } from '@/components/ui/skeleton'

export function SearchSkeleton() {
	return (
		<div className='space-y-8'>
			{/* Products section */}
			<section className='space-y-3'>
				<Skeleton className='h-5 w-32' />
				<div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className='space-y-2'>
							<Skeleton className='aspect-square w-full rounded-lg' />
							<Skeleton className='h-3 w-3/4' />
							<Skeleton className='h-3 w-1/2' />
						</div>
					))}
				</div>
			</section>

			{/* Stores section */}
			<section className='space-y-3'>
				<Skeleton className='h-5 w-28' />
				<div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='flex items-center gap-3'>
							<Skeleton className='size-12 rounded-full' />
							<div className='space-y-1.5'>
								<Skeleton className='h-3 w-24' />
								<Skeleton className='h-2.5 w-16' />
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Categories section */}
			<section className='space-y-3'>
				<Skeleton className='h-5 w-36' />
				<div className='flex flex-wrap gap-2'>
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className='h-8 w-24 rounded-full' />
					))}
				</div>
			</section>
		</div>
	)
}
