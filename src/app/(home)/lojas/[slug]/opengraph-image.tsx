import { ogSize, renderOgImage } from '@/lib/seo/og-image'
import { getStoreSeo } from '@/lib/seo/queries'
import { SITE_NAME } from '@/lib/seo/site'

export const alt = 'Loja no Zuka'
export const size = ogSize
export const contentType = 'image/png'

export default async function StoreOpenGraphImage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const store = await getStoreSeo(slug)

	if (!store) {
		return renderOgImage({
			title: SITE_NAME,
			subtitle: 'Loja no marketplace de Moçambique',
		})
	}

	return renderOgImage({
		title: store.name,
		subtitle:
			[store.province, store.neighborhood].filter(Boolean).join(' · ') ||
			'Loja no Zuka',
		imageUrl: store.bannerUrl || store.logoUrl,
	})
}
