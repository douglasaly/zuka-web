'use client'

import { useEffect, useState } from 'react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'

const PREFS_KEY = 'zuka:seller-notification-prefs'

export type NotificationPrefs = {
	orders: boolean
	messages: boolean
	reviews: boolean
}

const DEFAULT_PREFS: NotificationPrefs = {
	orders: true,
	messages: true,
	reviews: true,
}

function readPrefs(): NotificationPrefs {
	if (typeof window === 'undefined') return DEFAULT_PREFS
	try {
		const raw = localStorage.getItem(PREFS_KEY)
		if (!raw) return DEFAULT_PREFS
		const parsed = JSON.parse(raw) as Partial<NotificationPrefs>
		return {
			orders: parsed.orders ?? DEFAULT_PREFS.orders,
			messages: parsed.messages ?? DEFAULT_PREFS.messages,
			reviews: parsed.reviews ?? DEFAULT_PREFS.reviews,
		}
	} catch {
		return DEFAULT_PREFS
	}
}

export function useSellerSettings() {
	const { profile, isLoading, isAuthenticated } = useUserProfile()
	const { can } = useSellerAccess()
	const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS)
	const [prefsReady, setPrefsReady] = useState(false)

	useEffect(() => {
		setPrefs(readPrefs())
		setPrefsReady(true)
	}, [])

	function updatePref(key: keyof NotificationPrefs, value: boolean) {
		setPrefs((prev) => {
			const next = { ...prev, [key]: value }
			try {
				localStorage.setItem(PREFS_KEY, JSON.stringify(next))
			} catch {
				/* ignore quota / private mode */
			}
			return next
		})
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
		prefs,
		prefsReady,
		updatePref,
		store,
		storeName,
	}
}
