import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerOrdersView } from '@/modules/seller/ui/views/seller-orders-view'

function OrdersFallback() {
	return (
		<div className='w-full min-w-0 space-y-4'>
			<Skeleton className='h-4 w-72' />
			<div className='flex flex-col gap-3 sm:flex-row'>
				<Skeleton className='h-10 w-full rounded-full sm:max-w-sm' />
				<Skeleton className='h-10 w-36 rounded-full' />
				<Skeleton className='h-10 w-40 rounded-full' />
			</div>
			<div className='overflow-hidden rounded-xl border border-border'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 border-b border-border px-4 py-4 last:border-0'
					>
						<div className='min-w-0 flex-1 space-y-2'>
							<Skeleton className='h-4 w-28' />
							<Skeleton className='h-3 w-48' />
						</div>
						<Skeleton className='h-5 w-20 rounded-full' />
					</div>
				))}
			</div>
		</div>
	)
}
export default function SellerOrdersPage() {
	return (
		<Suspense fallback={<OrdersFallback />}>
			<SellerOrdersView />
		</Suspense>
	)
}
