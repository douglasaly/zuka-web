'use client'

import { useRouter } from 'next/navigation'
import { useNotificationPush } from '@/hooks/use-notification-push'
import { useShortcuts } from '@/hooks/use-shortcut'

export const SellerLayoutClient = () => {
	const router = useRouter()

	useNotificationPush()

	useShortcuts({
		p: () => router.push('/dashboard/seller/produtos'),
		o: () => router.push('/dashboard/seller/pedidos'),
		m: () => router.push('/dashboard/seller/mensagens'),
		a: () => router.push('/dashboard/seller/analytics'),
		n: () => router.push('/dashboard/seller/produtos/novo'),
	})

	return null
}
