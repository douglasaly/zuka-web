'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useBrowserNotificationPermission } from '@/hooks/use-browser-notification-permission'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'

export type NotificationPrefs = {
	orders: boolean
	messages: boolean
	reviews: boolean
}

export function useSellerSettings() {
	const { profile, isLoading, isAuthenticated } = useUserProfile()
	const { can } = useSellerAccess()
	const {
		preferences,
		isReady,
		updatePreferences,
		isLoading: prefsLoading,
		isUpdating,
	} = useUserPreferences()
	const browserPermission = useBrowserNotificationPermission()

	const serverPrefs = preferences.seller.notifications
	const [draft, setDraft] = useState<NotificationPrefs>(serverPrefs)

	useEffect(() => {
		setDraft({ ...serverPrefs })
	}, [serverPrefs])

	const dirty =
		draft.orders !== serverPrefs.orders ||
		draft.messages !== serverPrefs.messages ||
		draft.reviews !== serverPrefs.reviews

	function updatePref(key: keyof NotificationPrefs, value: boolean) {
		setDraft((prev) => ({ ...prev, [key]: value }))
	}

	async function savePrefs() {
		const wantsBrowserAlerts =
			draft.orders || draft.messages || draft.reviews

		let permissionNote: 'granted' | 'denied' | 'blocked' | null = null
		if (wantsBrowserAlerts && browserPermission.isDefault) {
			const result = await browserPermission.requestPermission()
			if (result === 'granted') permissionNote = 'granted'
			else if (result === 'denied') permissionNote = 'denied'
		} else if (wantsBrowserAlerts && browserPermission.denied) {
			permissionNote = 'blocked'
		}

		try {
			await updatePreferences({
				seller: { notifications: draft },
			})
			if (permissionNote === 'granted') {
				toast.success('Preferências e alertas do navegador activados')
			} else if (permissionNote === 'denied') {
				toast.message(
					'Preferências guardadas. Alertas do navegador bloqueados - active-os nas definições do navegador.'
				)
			} else if (permissionNote === 'blocked') {
				toast.message(
					'Preferências guardadas. Para alertas no desktop, permita notificações para este site no browser.'
				)
			} else {
				toast.success('Preferências guardadas')
			}
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Não foi possível guardar as preferências'
			)
		}
	}

	async function enableBrowserNotifications() {
		const result = await browserPermission.requestPermission()
		if (result === 'granted') {
			toast.success('Alertas do navegador activados')
		} else if (result === 'denied') {
			toast.error(
				'Notificações bloqueadas. Altere a permissão deste site nas definições do navegador.'
			)
		} else if (result === 'unsupported') {
			toast.error('Este navegador não suporta notificações.')
		}
	}

	const store = profile?.stores[0]
	const displayName = profile
		? [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim()
		: ''
	const storeName = store?.name || displayName || 'A sua conta'
	return {
		profile,
		isLoading,
		isAuthenticated,
		can,
		prefs: draft,
		prefsReady: isAuthenticated ? isReady && !prefsLoading : true,
		prefsDirty: dirty,
		isSavingPrefs: isUpdating,
		updatePref,
		savePrefs,
		browserPermission,
		enableBrowserNotifications,
		store,
		storeName,
	}
}
