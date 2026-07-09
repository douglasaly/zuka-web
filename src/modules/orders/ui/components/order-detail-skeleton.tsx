import { Skeleton } from '@/components/ui/skeleton'

export const OrderDetailSkeleton = () => (
	<div className='mx-auto max-w-2xl px-4 py-6 md:py-8'>
		<Skeleton className='mb-4 h-9 w-24 rounded-md' />

		<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
			<div className='flex items-center gap-3 border-b border-border/60 p-4'>
				<Skeleton className='size-12 shrink-0 rounded-full' />
				<div className='min-w-0 flex-1 space-y-1.5'>
					<Skeleton className='h-5 w-40 rounded-md' />
					<Skeleton className='h-4 w-28 rounded-md' />
				</div>
				<Skeleton className='h-6 w-20 rounded-full' />
			</div>

			<div className='space-y-4 p-4'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className='flex items-center justify-between'>
						<Skeleton className='h-4 w-48 rounded-md' />
						<Skeleton className='h-4 w-16 rounded-md' />
					</div>
				))}
			</div>

			<div className='flex items-center justify-between border-t border-border/60 p-4'>
				<Skeleton className='h-5 w-12 rounded-md' />
				<Skeleton className='h-6 w-24 rounded-md' />
			</div>
		</div>

		<Skeleton className='mt-4 h-11 w-full rounded-xl' />
	</div>
)
