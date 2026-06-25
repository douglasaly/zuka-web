import { StoreDetailView } from '@/modules/admin/ui/views/store-detail-view'

type Props = { params: Promise<{ id: string }> }

export default async function StoreDetailPage({ params }: Props) {
	const { id } = await params
	return <StoreDetailView id={id} />
}
