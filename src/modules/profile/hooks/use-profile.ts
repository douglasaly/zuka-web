'use client'

import {
	CircleQuestionMark,
	Heart,
	LogOut,
	Settings,
	Store,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSavedItems } from '@/hooks/use-saved-items'
import { useUserProfile } from '@/hooks/use-user-profile'
import { normalizeStore } from '@/types/stores'

export const PROFILE_TABS = [
	{ title: 'Guardados', icon: Heart },
	{ title: 'Lojas seguidas', icon: Store },
] as const

export const PROFILE_OPTIONS = [
	{ title: 'Definições', icon: Settings, url: '/perfil/definicoes' },
	{
		title: 'Ajuda e suporte',
		icon: CircleQuestionMark,
		url: '/ajuda-e-suporte',
	},
	{ title: 'Sair', icon: LogOut, url: '/log-out' },
] as const

export function useProfile() {
	const [tab, setTab] = useState('Guardados')
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		const initialTab = searchParams.get('tab')

		if (initialTab && PROFILE_TABS.some((t) => t.title === initialTab)) {
			setTab(initialTab)
		}
	}, [searchParams])

	const {
		profile,
		isAuthenticated,
		isLoading,
		isSeller,
		followedCount,
		followedStores,
		isFollowedStoresLoading,
	} = useUserProfile()

	const { savedItems, toggleSavedItem, isRemoving, isSavedItemsLoading } =
		useSavedItems()

	const displayName = profile
		? [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
			'Utilizador'
		: 'Utilizador'

	const stats = [
		{
			label: 'Guardados',
			value: savedItems.length,
			isLoading: isSavedItemsLoading,
		},
		{
			label: 'A seguir',
			value: followedCount,
			isLoading: isFollowedStoresLoading,
		},
		{ label: 'Pedidos', value: 5 }, // TODO: ligar à API de pedidos
	]

	const normalizedStores = followedStores.map(normalizeStore) ?? []

	function handleRemoveItem(itemId: string) {
		toggleSavedItem(itemId)
	}

	const handleSetTab = (newTab: string) => {
		const params = new URLSearchParams(searchParams.toString())

		params.set('tab', newTab)

		router.replace(`${pathname}?${params.toString()}`, {
			scroll: false,
		})

		setTab(newTab)
	}

	return {
		tab,
		handleSetTab,
		router,
		profile,
		isAuthenticated,
		isLoading,
		isSeller,
		followedStores,
		isFollowedStoresLoading,
		savedItems,
		isRemoving,
		isSavedItemsLoading,
		displayName,
		stats,
		normalizedStores,
		handleRemoveItem,
	}
}
