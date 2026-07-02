import type { Metadata } from 'next'
import { NotificationsView } from '@/modules/notifications/ui/views/notifications-view'

export const metadata: Metadata = {
	title: 'Notificações',
}

export default function NotificacoesPage() {
	return <NotificationsView />
}
