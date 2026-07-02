import { requireSessionPage } from '@/lib/auth/require-session-page'
import { OrderDetailView } from '@/modules/orders/ui/views/order-detail-view'

interface OrderDetailPageProps {
	params: Promise<{ id: string }>
}

export default async function OrderDetailPage({
	params,
}: OrderDetailPageProps) {
	const { id } = await params
	await requireSessionPage(`/feed/pedidos/${id}`)
	return <OrderDetailView id={id} />
}
