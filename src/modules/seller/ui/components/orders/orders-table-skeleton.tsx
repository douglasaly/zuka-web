'use client'
import { Skeleton } from '@/components/ui/skeleton'
export function OrdersTableSkeleton() {
	return (
		<div className='w-full min-w-0 space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
				<Skeleton className='h-10 w-full rounded-full sm:max-w-sm' />
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-36 rounded-full' />
					<Skeleton className='h-10 w-40 rounded-full' />
				</div>
			</div>
			<Skeleton className='h-4 w-48' />
			<div className='overflow-hidden rounded-xl border border-border'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 border-b border-border px-4 py-4 last:border-0'
					>
						<div className='min-w-0 flex-1 space-y-2'>
							<Skeleton className='h-4 w-28' />
							<Skeleton className='h-3 w-48 max-w-full' />
						</div>
						<Skeleton className='h-5 w-20 rounded-full' />
					</div>
				))}
			</div>
		</div>
	)
}
