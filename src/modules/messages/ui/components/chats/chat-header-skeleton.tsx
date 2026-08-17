import { Skeleton } from '@/components/ui/skeleton'
export const ChatHeaderSkeleton = () => (
	<div className='fixed left-0 right-0 top-0 z-50 flex items-center gap-2 border bg-white p-4 pt-6 md:left-72 md:right-8'>
		<Skeleton className='size-9 rounded-full' />

		<div className='h-10 w-px bg-border' />

		<div className='flex flex-1 items-center gap-2'>
			<Skeleton className='size-10 rounded-full' />

			<div className='flex flex-col justify-center space-y-1.5'>
				<Skeleton className='h-4 w-32 rounded-md' />
				<Skeleton className='h-3 w-24 rounded-md' />
			</div>
		</div>
	</div>
)
