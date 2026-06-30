import { Skeleton } from '@/components/ui/skeleton'

export const MessagesSkeleton = () => (
	<div className='flex flex-col space-y-4 px-8 pt-24'>
		{Array.from({ length: 6 }).map((_, i) => (
			<div
				key={i}
				className='flex h-18 w-full items-center gap-2 rounded-xl border bg-white p-4 py-8'
			>
				<Skeleton className='size-12 shrink-0 rounded-full' />

				<div className='ml-3 flex-1 space-y-2'>
					<Skeleton className='h-4 w-20 md:w-32 rounded-md' />
					<Skeleton className='h-3 w-24 md:w-56 rounded-md' />
				</div>

				<Skeleton className='h-3 w-8 md:w-10 shrink-0 rounded-md' />
			</div>
		))}
	</div>
)
