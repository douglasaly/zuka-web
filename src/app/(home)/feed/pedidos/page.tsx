import { OrdersView } from '@/modules/orders/ui/views/orders-view'
import { requireSessionPage } from '@/lib/auth/require-session-page'

export default async function OrdersPage() {
	await requireSessionPage('/feed/pedidos')
	return <OrdersView />
}
