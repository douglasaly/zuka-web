import { Skeleton } from '@/components/ui/skeleton'
export const OrderDetailSkeleton = () => (
	<div className='mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8'>
		<div className='space-y-3'>
			<Skeleton className='h-10 w-36 rounded-md' />
			<div className='space-y-4 rounded-2xl border border-border/60 p-5 sm:p-6'>
				<div className='flex items-start justify-between gap-3'>
					<div className='space-y-2'>
						<Skeleton className='h-3 w-24 rounded-md' />
						<Skeleton className='h-8 w-64 rounded-md sm:w-80' />
					</div>
					<Skeleton className='h-6 w-28 rounded-full' />
				</div>
				<Skeleton className='h-10 w-full max-w-xl rounded-md' />
				<Skeleton className='h-3 w-40 rounded-md' />
			</div>
		</div>

		<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
			<div className='min-w-0 flex-1 space-y-6'>
				<div className='space-y-3'>
					<Skeleton className='h-4 w-32 rounded-md' />
					<div className='space-y-4 rounded-2xl border border-border/60 p-4 sm:p-5'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='flex gap-3.5'>
								<Skeleton className='size-7 rounded-full' />
								<div className='space-y-1.5 pt-0.5'>
									<Skeleton className='h-4 w-32 rounded-md' />
									<Skeleton className='h-3 w-24 rounded-md' />
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='space-y-3'>
					<div className='flex items-end justify-between'>
						<Skeleton className='h-4 w-28 rounded-md' />
						<Skeleton className='h-4 w-20 rounded-md' />
					</div>
					<div className='overflow-hidden rounded-2xl border border-border/60'>
						{Array.from({ length: 2 }).map((_, i) => (
							<div
								key={i}
								className='flex gap-3 border-b border-border/60 p-4 last:border-b-0'
							>
								<Skeleton className='size-16 rounded-xl sm:size-18' />
								<div className='min-w-0 flex-1 space-y-1.5'>
									<Skeleton className='h-4 w-40 rounded-md' />
									<Skeleton className='h-3 w-28 rounded-md' />
								</div>
								<Skeleton className='h-4 w-16 rounded-md' />
							</div>
						))}
						<div className='flex items-center justify-between bg-muted/35 px-4 py-3.5'>
							<Skeleton className='h-4 w-24 rounded-md' />
							<Skeleton className='h-6 w-24 rounded-md' />
						</div>
					</div>
				</div>
			</div>

			<div className='w-full shrink-0 space-y-3 lg:w-96 xl:w-104'>
				<div className='space-y-4 rounded-2xl border border-border/60 p-5 sm:p-6'>
					<Skeleton className='h-5 w-40 rounded-md' />
					<Skeleton className='h-10 w-full rounded-md' />
					<Skeleton className='h-20 w-full rounded-xl' />
					<Skeleton className='h-16 w-full rounded-xl' />
					<Skeleton className='h-11 w-full rounded-xl' />
				</div>
			</div>
		</div>
	</div>
)
