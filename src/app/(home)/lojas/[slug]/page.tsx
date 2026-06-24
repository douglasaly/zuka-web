import { StoreView } from '@/modules/store/ui/views/store-view'

interface StorePageProps {
	params: Promise<{ slug: string }>
}

export default async function StorePage({ params }: StorePageProps) {
	const { slug } = await params
	return <StoreView slug={slug} />
}
