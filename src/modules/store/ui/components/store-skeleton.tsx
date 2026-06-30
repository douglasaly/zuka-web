import { Skeleton } from '@/components/ui/skeleton'

export const StoreSkeleton = () => (
	<div className='pb-10'>
		<Skeleton className='h-48 w-full rounded-none md:h-56' />

		<div className='mx-auto max-w-4xl px-4 md:px-6'>
			<div className='relative -mt-16 rounded-2xl border border-border/60 bg-card p-5'>
				<div className='flex gap-4'>
					<Skeleton className='size-20 shrink-0 rounded-xl' />

					<div className='flex-1 space-y-2 pt-1'>
						<Skeleton className='h-5 w-40 rounded-md' />
						<Skeleton className='h-4 w-32 rounded-md' />
						<Skeleton className='h-4 w-56 rounded-md' />
					</div>
				</div>

				<div className='mt-4 flex gap-2'>
					<Skeleton className='h-11 flex-1 rounded-xl' />
					<Skeleton className='h-11 flex-1 rounded-xl' />
					<Skeleton className='h-11 w-24 rounded-xl' />
				</div>
			</div>

			<div className='mt-6 flex gap-6 border-b border-border/60 pb-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className='h-4 w-20 rounded-md' />
				))}
			</div>

			<div className='mt-6 grid grid-cols-2 gap-3 sm:gap-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className='space-y-2'>
						<Skeleton className='aspect-4/5 w-full rounded-2xl' />
						<Skeleton className='h-4 w-full rounded-md' />
						<Skeleton className='h-4 w-1/2 rounded-md' />
					</div>
				))}
			</div>
		</div>
	</div>
)
