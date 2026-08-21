'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
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
		try {
			await updatePreferences({
				seller: { notifications: draft },
			})
			toast.success('Preferências guardadas')
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Não foi possível guardar as preferências'
			)
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
		store,
		storeName,
	}
}
