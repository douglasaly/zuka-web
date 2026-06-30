'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { fetchUserProfile } from '@/lib/api/marketplace'
import { getFollowedStores } from '@/lib/api/stores'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import type { UserProfile } from '@/types/marketplace'

export function useUserProfile() {
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
	const [authReady, setAuthReady] = useState(false)
	const queryClient = useQueryClient()

	useEffect(() => {
		return onAuthStateChanged(auth, (user) => {
			setFirebaseUser(user)
			setAuthReady(true)
			if (!user) {
				queryClient.removeQueries({ queryKey: ['user-profile'] })
			}
		})
	}, [queryClient])

	const { data: profile, isLoading: profileLoading } = useQuery({
		queryKey: ['user-profile'],
		queryFn: async () => {
			await createAppSession()
			return fetchUserProfile()
		},
		enabled: authReady && Boolean(firebaseUser),
		retry: false,
	})

	const resolvedProfile = (profile ?? null) as UserProfile | null
	const hasValidSession = Boolean(resolvedProfile)

	const { data: followedData } = useQuery({
		queryKey: ['followed-stores', { limit: 8, cursor: undefined }],
		queryFn: getFollowedStores,
		staleTime: 1000 * 60 * 5,
	})

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
	}
}
