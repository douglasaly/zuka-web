import { ogSize, renderOgImage } from '@/lib/seo/og-image'
import { getProductSeo } from '@/lib/seo/queries'
import { SITE_NAME } from '@/lib/seo/site'
import { formatPrice } from '@/utils/format-price'

export const alt = 'Produto no Zuka'
export const size = ogSize
export const contentType = 'image/png'

export default async function ProductOpenGraphImage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const product = await getProductSeo(id)

	if (!product) {
		return renderOgImage({
			title: SITE_NAME,
			subtitle: 'Produto no marketplace de Moçambique',
		})
	}

	return renderOgImage({
		title: product.name,
		subtitle: [
			formatPrice(
				product.discountPrice ?? product.price,
				product.currency
			),
			product.storeName,
		]
			.filter(Boolean)
			.join(' · '),
		imageUrl: product.imageUrl,
	})
}
