import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { pageMetadata } from '@/lib/seo/metadata'
import { getProductSeo } from '@/lib/seo/queries'
import { ProductReviewsView } from '@/modules/product/ui/views/product-reviews-view'

interface PageProps {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params
	const product = await getProductSeo(id)

	if (!product) {
		return pageMetadata({
			title: 'Avaliações',
			path: `/product/${id}/avaliacoes`,
			index: false,
			follow: false,
		})
	}

	return pageMetadata({
		title: `Avaliações de ${product.name}`,
		description: `Veja o que compradores dizem sobre ${product.name} no Zuka.`,
		path: `/product/${id}/avaliacoes`,
		images: product.imageUrl ? [product.imageUrl] : undefined,
	})
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
