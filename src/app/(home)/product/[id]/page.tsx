import { ProductDetailView } from '@/modules/product/ui/views/product-detail-view'

interface ProductPageProps {
	params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { id } = await params
	return <ProductDetailView id={id} />
}
