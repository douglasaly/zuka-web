import { Skeleton } from '@/components/ui/skeleton'

export const NotificationsSkeleton = () => (
	<div className='space-y-1 p-2'>
		{Array.from({ length: 3 }).map((_, i) => (
			<div key={i} className='flex items-start gap-3 rounded-xl p-3'>
				<Skeleton className='mt-0.5 size-8 shrink-0 rounded-full' />
				<div className='flex-1 space-y-2'>
					<Skeleton className='h-3.5 w-2/3 rounded-md' />
					<Skeleton className='h-3 w-full rounded-md' />
					<Skeleton className='h-2.5 w-1/3 rounded-md' />
				</div>
			</div>
		))}
	</div>
)
