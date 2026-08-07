import { Skeleton } from '@/components/ui/skeleton'

export function StoreDetailLoading() {
	return (
		<div className='space-y-6'>
			<Skeleton className='h-8 w-48' />
			<div className='grid gap-4 md:grid-cols-2'>
				<Skeleton className='h-64 rounded-2xl' />
				<Skeleton className='h-64 rounded-2xl' />
			</div>
		</div>
	)
}
