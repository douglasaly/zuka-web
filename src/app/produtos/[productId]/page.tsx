import { ProductView } from '@/modules/product/ui/views/product-view'

interface PageProps {
	params: Promise<{ productId: string }>
}

const Page = async ({ params }: PageProps) => {
	const { productId } = await params

	return <ProductView productId={productId} />
}

export default Page
