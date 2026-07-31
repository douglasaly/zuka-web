'use client'

import { useRouter } from 'next/navigation'
import { useNotificationPush } from '@/hooks/use-notification-push'
import { useShortcuts } from '@/hooks/use-shortcut'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'

export const SellerLayoutClient = () => {
	const router = useRouter()
	const { can } = useSellerAccess()

	useNotificationPush()

	useShortcuts({
		...(can('product.read')
			? { p: () => router.push('/dashboard/seller/produtos') }
			: {}),
		...(can('order.read')
			? { o: () => router.push('/dashboard/seller/pedidos') }
			: {}),
		...(can('message.read')
			? { m: () => router.push('/dashboard/seller/mensagens') }
			: {}),
		...(can('product.create')
			? { n: () => router.push('/dashboard/seller/produtos/novo') }
			: {}),
	})

	return null
}
