import { ProductDetailView } from '@/modules/product/ui/views/product-detail-view'

interface PageProps {
	params: Promise<{ productId: string }>
}

export default async function Page({ params }: PageProps) {
	const { productId } = await params

	return <ProductDetailView id={productId} />
}
