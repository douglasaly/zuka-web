'use client'

import { useCallback, useEffect, useState } from 'react'
import {
	type BrowserNotificationPermission,
	getBrowserNotificationPermission,
	isBrowserNotificationSupported,
	requestBrowserNotificationPermission,
} from '@/lib/notifications/browser'

export function useBrowserNotificationPermission() {
	const [permission, setPermission] =
		useState<BrowserNotificationPermission>('unsupported')
	const [ready, setReady] = useState(false)

	useEffect(() => {
		setPermission(getBrowserNotificationPermission())
		setReady(true)

		if (!isBrowserNotificationSupported()) return
		if (!navigator.permissions?.query) return

		let status: PermissionStatus | undefined
		let cancelled = false

		const sync = () => {
			if (!cancelled) setPermission(getBrowserNotificationPermission())
		}

		void navigator.permissions
			.query({ name: 'notifications' as PermissionName })
			.then((result) => {
				if (cancelled) return
				status = result
				sync()
				result.addEventListener('change', sync)
			})
			.catch(() => {
				/* Safari / older browsers may reject */
			})

		return () => {
			cancelled = true
			status?.removeEventListener('change', sync)
		}
	}, [])

	const requestPermission = useCallback(async () => {
		const next = await requestBrowserNotificationPermission()
		setPermission(next)
		return next
	}, [])

	return {
		permission,
		ready,
		supported: permission !== 'unsupported',
		granted: permission === 'granted',
		denied: permission === 'denied',
		isDefault: permission === 'default',
		requestPermission,
	}
}
