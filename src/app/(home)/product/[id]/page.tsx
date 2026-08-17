import type { Metadata } from 'next'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata, productDescription } from '@/lib/seo/metadata'
import { getProductSeo } from '@/lib/seo/queries'
import { productJsonLd } from '@/lib/seo/schema'
import { ProductDetailView } from '@/modules/product/ui/views/product-detail-view'

interface ProductPageProps {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { id } = await params
	const product = await getProductSeo(id)

	if (!product) {
		return pageMetadata({
			title: 'Produto não encontrado',
			path: `/product/${id}`,
			index: false,
			follow: false,
		})
	}

	const description = productDescription(
		product.name,
		product.storeName,
		product.description
	)

	return pageMetadata({
		title: product.name,
		description,
		path: `/product/${id}`,
		images: product.imageUrl ? [product.imageUrl] : undefined,
	})
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { id } = await params
	const product = await getProductSeo(id)

	return (
		<>
			{product ? <JsonLd data={productJsonLd(product)} /> : null}
			<ProductDetailView id={id} />
		</>
	)
}
