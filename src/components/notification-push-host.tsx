'use client'

import { useNotificationPush } from '@/hooks/use-notification-push'

export function NotificationPushHost() {
	useNotificationPush()
	return null
}
