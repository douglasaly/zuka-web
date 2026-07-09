import { Skeleton } from '@/components/ui/skeleton'

export const OrderSkeleton = () => (
	<div className='space-y-3'>
		{Array.from({ length: 3 }).map((_, i) => (
			<div
				key={i}
				className='overflow-hidden rounded-2xl border border-border/60 bg-card'
			>
				<div className='flex items-center gap-3 p-4'>
					<Skeleton className='size-11 shrink-0 rounded-full' />
					<div className='min-w-0 flex-1 space-y-1.5'>
						<Skeleton className='h-4 w-36 rounded-md' />
						<Skeleton className='h-3.5 w-24 rounded-md' />
					</div>
					<Skeleton className='h-6 w-20 rounded-full' />
				</div>
				<div className='flex items-center justify-between border-t border-border/60 px-4 py-3'>
					<Skeleton className='h-5 w-20 rounded-md' />
					<Skeleton className='h-4 w-24 rounded-md' />
				</div>
			</div>
		))}
	</div>
)
