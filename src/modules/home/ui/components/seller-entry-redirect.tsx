'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { hasActiveStore } from '@/lib/auth/routing'
import {
	consumeSellerEntryCheck,
	isSellerEntryPath,
	isViewAsBuyerMode,
} from '@/lib/auth/view-as-buyer'

export function SellerEntryRedirect() {
	const router = useRouter()
	const pathname = usePathname()
	const { profile, isLoading, isAuthenticated } = useUserProfile()

	useEffect(() => {
		if (isLoading) return

		if (!consumeSellerEntryCheck()) return

		if (!isAuthenticated || !profile) return
		if (!isSellerEntryPath(pathname)) return
		if (isViewAsBuyerMode()) return
		if (!hasActiveStore(profile)) return

		router.replace('/dashboard/seller')
	}, [isAuthenticated, isLoading, pathname, profile, router])

	return null
}
