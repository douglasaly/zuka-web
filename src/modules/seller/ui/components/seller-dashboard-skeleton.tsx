import { Skeleton } from '@/components/ui/skeleton'

export const SellerWelcomeBannerSkeleton = () => (
	<div className='rounded-2xl bg-linear-to-br from-neutral-900 to-neutral-800 px-8 py-10'>
		<Skeleton className='mb-2 h-4 w-24 bg-neutral-700' />
		<Skeleton className='h-9 w-48 bg-neutral-700' />
	</div>
)

export const SellerStatCardSkeleton = () => (
	<div className='rounded-2xl border bg-white p-5'>
		<Skeleton className='mb-4 size-10 rounded-full' />
		<Skeleton className='mb-2 h-8 w-24' />
		<Skeleton className='h-4 w-20' />
	</div>
)

export const SellerStatsGridSkeleton = () => (
	<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
		{Array.from({ length: 6 }).map((_, i) => (
			<SellerStatCardSkeleton key={i} />
		))}
	</div>
)

export const SellerDashboardSkeleton = () => (
	<div className='space-y-6'>
		<SellerWelcomeBannerSkeleton />
		<SellerStatsGridSkeleton />
		<div className='flex flex-wrap gap-3'>
			<Skeleton className='h-10 w-36 rounded-xl' />
			<Skeleton className='h-10 w-32 rounded-xl' />
			<Skeleton className='h-10 w-36 rounded-xl' />
		</div>
		<Skeleton className='h-12 w-full rounded-xl' />
		<div className='rounded-2xl border bg-card p-6 sm:p-8'>
			<div className='space-y-4'>
				<Skeleton className='h-6 w-32' />
				<Skeleton className='h-4 w-full' />
				<Skeleton className='h-4 w-3/4' />
				<Skeleton className='h-40 w-full rounded-xl' />
			</div>
		</div>
	</div>
)
