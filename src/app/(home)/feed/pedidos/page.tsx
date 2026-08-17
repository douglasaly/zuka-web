import { requireSessionPage } from '@/lib/auth/require-session-page'
import { OrdersView } from '@/modules/orders/ui/views/orders-view'
export default async function OrdersPage() {
	await requireSessionPage('/feed/pedidos')
	return <OrdersView />
}
