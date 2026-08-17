import type { Metadata } from 'next'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata, storeDescription } from '@/lib/seo/metadata'
import { getStoreSeo } from '@/lib/seo/queries'
import { storeJsonLd } from '@/lib/seo/schema'
import { StoreView } from '@/modules/store/ui/views/store-view'

interface StorePageProps {
	params: Promise<{
		slug: string
	}>
}

export async function generateMetadata({
	params,
}: StorePageProps): Promise<Metadata> {
	const { slug } = await params
	const store = await getStoreSeo(slug)

	if (!store) {
		return pageMetadata({
			title: 'Loja não encontrada',
			path: `/lojas/${slug}`,
			index: false,
			follow: false,
		})
	}

	const image = store.bannerUrl || store.logoUrl || undefined
	const description = storeDescription(store.name, store.description)

	return pageMetadata({
		title: store.name,
		description,
		path: `/lojas/${slug}`,
		images: image ? [image] : undefined,
	})
}

export default async function StorePage({ params }: StorePageProps) {
	const { slug } = await params
	const store = await getStoreSeo(slug)

	return (
		<>
			{store ? <JsonLd data={storeJsonLd(store)} /> : null}
			<StoreView slug={slug} />
		</>
	)
}
