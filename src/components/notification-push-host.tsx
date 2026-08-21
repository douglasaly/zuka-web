'use client'

import { useNotificationPush } from '@/hooks/notifications/use-notification-push'

export function NotificationPushHost() {
	useNotificationPush()
	return null
}
