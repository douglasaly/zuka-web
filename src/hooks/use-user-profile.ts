'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { fetchUserProfile } from '@/lib/api/marketplace'
import { getFollowedStores } from '@/lib/api/stores'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import type { UserProfile } from '@/types/marketplace'

export function useUserProfile() {
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
	const [authReady, setAuthReady] = useState(false)
	const queryClient = useQueryClient()
	const previousUid = useRef<string | null>(null)

	useEffect(() => {
		return onAuthStateChanged(auth, (user) => {
			const nextUid = user?.uid ?? null
			const prevUid = previousUid.current

			// Logout or account switch: drop cached user data so the next
			// session never inherits orders/badges from another account.
			if (prevUid && prevUid !== nextUid) {
				queryClient.clear()
			} else if (!user) {
				queryClient.clear()
			}

			previousUid.current = nextUid
			setFirebaseUser(user)
			setAuthReady(true)
		})
	}, [queryClient])

	const { data: profile, isLoading: profileLoading } = useQuery({
		queryKey: ['user-profile', firebaseUser?.uid],
		queryFn: async () => {
			await createAppSession()
			return fetchUserProfile()
		},
		enabled: authReady && Boolean(firebaseUser),
		staleTime: 1000 * 60 * 10,
		retry: false,
	})

	const resolvedProfile = (profile ?? null) as UserProfile | null
	const hasValidSession = Boolean(resolvedProfile)

	const { data: followedData, isLoading: isFollowedStoresLoading } = useQuery(
		{
			queryKey: [
				'followed-stores',
				resolvedProfile?.id,
				{ limit: 8, cursor: undefined },
			],
			queryFn: getFollowedStores,
			staleTime: 1000 * 60 * 5,
			enabled: authReady && Boolean(firebaseUser) && hasValidSession,
		}
	)

	const followedStores = followedData?.data ?? []
	const followedCount = followedData?.metaData?.total ?? 0

	return {
		firebaseUser,
		profile: resolvedProfile,
		isLoading:
			!authReady ||
			(Boolean(firebaseUser) && profileLoading && !hasValidSession),
		isAuthenticated: hasValidSession,
		isSeller: Boolean(resolvedProfile?.roles.includes('seller')),
		isBuyer: Boolean(resolvedProfile?.roles.includes('buyer')),
		followedStores,
		followedCount,
		isFollowedStoresLoading,
	}
}
