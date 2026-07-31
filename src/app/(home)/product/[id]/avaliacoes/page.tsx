import { Suspense } from 'react'
import { ProductReviewsView } from '@/modules/product/ui/views/product-reviews-view'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function ProductReviewsPage({ params }: PageProps) {
	const { id } = await params
	return (
		<Suspense fallback={<ReviewsRouteFallback />}>
			<ProductReviewsView productId={id} />
		</Suspense>
	)
}

function ReviewsRouteFallback() {
	return (
		<div className='mx-auto max-w-4xl space-y-5 px-4 pt-4 md:px-0'>
			<Skeleton className='h-5 w-36' />
			<Skeleton className='h-24 w-full rounded-2xl' />
			<Skeleton className='h-36 w-full rounded-2xl' />
		</div>
	)
}
