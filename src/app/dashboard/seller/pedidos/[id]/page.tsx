import { SellerOrderDetailView } from '@/modules/seller/ui/views/seller-order-detail-view'

export default async function SellerOrderDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	return <SellerOrderDetailView id={id} />
}
