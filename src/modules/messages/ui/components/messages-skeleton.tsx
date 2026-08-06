import { Skeleton } from '@/components/ui/skeleton'

export const MessagesSkeleton = () => (
	<div className='flex w-full flex-col gap-3 pt-24'>
		{Array.from({ length: 6 }).map((_, i) => (
			<div
				key={i}
				className='flex min-h-18 w-full items-center gap-3 rounded-xl border bg-card p-4 py-5'
			>
				<Skeleton className='size-12 shrink-0 rounded-full' />
				<div className='ml-1 flex-1 space-y-2'>
					<div className='flex items-center justify-between gap-2'>
						<Skeleton className='h-4 w-28 rounded-md sm:w-36' />
						<Skeleton className='h-3 w-10 shrink-0 rounded-md' />
					</div>
					<Skeleton className='h-3 w-40 rounded-md sm:w-56' />
				</div>
				<Skeleton className='size-5 shrink-0 rounded-md' />
			</div>
		))}
	</div>
)
