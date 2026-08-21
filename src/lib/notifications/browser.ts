
export type BrowserNotificationPermission =
	| NotificationPermission
	| 'unsupported'

export type ShowBrowserNotificationInput = {
	title: string
	body: string
	/** Dedupes / replaces earlier alerts of the same kind. */
	tag: string
	/** Path or absolute URL opened when the notification is clicked. */
	href?: string
	icon?: string
	/** When true (default), skip if the document is visible and focused. */
	onlyWhenHidden?: boolean
}

export function isBrowserNotificationSupported(): boolean {
	return (
		typeof window !== 'undefined' &&
		typeof Notification !== 'undefined' &&
		typeof window.isSecureContext === 'boolean' &&
		window.isSecureContext
	)
}

export function getBrowserNotificationPermission(): BrowserNotificationPermission {
	if (!isBrowserNotificationSupported()) return 'unsupported'
	return Notification.permission
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
	if (!isBrowserNotificationSupported()) return 'unsupported'
	if (Notification.permission === 'granted') return 'granted'
	if (Notification.permission === 'denied') return 'denied'
	try {
		const result = await Notification.requestPermission()
		return result
	} catch {
		return getBrowserNotificationPermission()
	}
}

function defaultIconUrl(): string {
	try {
		return new URL('/icon', window.location.origin).href
	} catch {
		return '/icon'
	}
}

function shouldSuppressForVisibility(onlyWhenHidden: boolean): boolean {
	if (!onlyWhenHidden) return false
	if (typeof document === 'undefined') return false
	return (
		document.visibilityState === 'visible' &&
		typeof document.hasFocus === 'function' &&
		document.hasFocus()
	)
}

export function showBrowserNotification(
	input: ShowBrowserNotificationInput
): Notification | null {
	if (!isBrowserNotificationSupported()) return null
	if (Notification.permission !== 'granted') return null
	if (shouldSuppressForVisibility(input.onlyWhenHidden ?? true)) return null

	try {
		const notification = new Notification(input.title, {
			body: input.body,
			icon: input.icon ?? defaultIconUrl(),
			badge: input.icon ?? defaultIconUrl(),
			tag: input.tag,
			requireInteraction: false,
		})

		notification.onclick = () => {
			try {
				window.focus()
			} catch {
				/* ignore */
			}
			if (input.href) {
				const url = input.href.startsWith('http')
					? input.href
					: new URL(input.href, window.location.origin).href
				window.location.assign(url)
			}
			notification.close()
		}

		return notification
	} catch {
		return null
	}
}

export function pluralPt(count: number, one: string, many: string): string {
	return count === 1 ? one : many
}
