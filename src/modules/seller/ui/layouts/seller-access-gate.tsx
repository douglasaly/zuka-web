'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserProfile } from '@/hooks/use-user-profile'
import { needsSellerOnboarding } from '@/lib/auth/routing'
import { SellerDashboardSkeleton } from '../components/seller-dashboard-skeleton'
export function SellerAccessGate({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { profile, isLoading, isAuthenticated } = useUserProfile()
	const mustOnboard =
		Boolean(isAuthenticated && profile) && needsSellerOnboarding(profile)
	useEffect(() => {
		if (isLoading || !mustOnboard) return
		router.replace('/onboarding/seller')
	}, [isLoading, mustOnboard, router])
	if (isLoading || mustOnboard) {
		return <SellerDashboardSkeleton />
	}
	return children
}
