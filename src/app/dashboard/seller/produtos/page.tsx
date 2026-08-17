import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerProductsView } from '@/modules/seller/ui/views/seller-products-view'

function ProductsFallback() {
	return (
		<div className='space-y-5'>
			<div className='flex items-center justify-between gap-3'>
				<Skeleton className='h-5 w-48' />
				<div className='flex gap-2'>
					<Skeleton className='h-9 w-28 rounded-full' />
					<Skeleton className='h-9 w-36 rounded-full' />
				</div>
			</div>
			<Skeleton className='h-10 w-full max-w-md rounded-full' />
			<div className='overflow-hidden rounded-2xl border border-border/60'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 border-b border-border/40 px-4 py-3 last:border-0'
					>
						<Skeleton className='size-4 rounded' />
						<Skeleton className='size-14 rounded-xl' />
						<div className='flex-1 space-y-2'>
							<Skeleton className='h-4 w-48' />
							<Skeleton className='h-3 w-28' />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default function SellerProductsPage() {
	return (
		<Suspense fallback={<ProductsFallback />}>
			<SellerProductsView />
		</Suspense>
	)
}
