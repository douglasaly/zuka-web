'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
	applyPreferencesPatch,
	DEFAULT_PREFERENCES,
	type PreferencesDocument,
	type UpdatePreferencesInput,
} from '@/lib/preferences/schema'

type PreferencesResponse = {
	preferences: PreferencesDocument
	isPersisted: boolean
}

async function fetchPreferences(): Promise<PreferencesResponse> {
	const res = await fetch('/api/me/preferences', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed to load preferences')
	const json = await res.json()
	return {
		preferences: json.preferences as PreferencesDocument,
		isPersisted: Boolean(json.isPersisted),
	}
}

async function patchPreferences(
	patch: UpdatePreferencesInput
): Promise<PreferencesDocument> {
	const res = await fetch('/api/me/preferences', {
		method: 'PATCH',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(patch),
	})
	if (!res.ok) {
		const json = await res.json().catch(() => ({}))
		const message =
			typeof json.error === 'string' ? json.error : json.error?.message
		throw new Error(message ?? 'Failed to update preferences')
	}
	const json = await res.json()
	return json.preferences as PreferencesDocument
}

export function useUserPreferences() {
	const { isAuthenticated, profile } = useUserProfile()
	const queryClient = useQueryClient()

	const queryKey = ['user-preferences', profile?.id] as const

	const query = useQuery({
		queryKey,
		queryFn: fetchPreferences,
		enabled: isAuthenticated && Boolean(profile?.id),
		staleTime: 1000 * 60 * 10,
		retry: false,
	})

	const mutation = useMutation({
		mutationFn: patchPreferences,
		onMutate: async (patch) => {
			await queryClient.cancelQueries({ queryKey })
			const previous =
				queryClient.getQueryData<PreferencesResponse>(queryKey)
			if (previous) {
				try {
					queryClient.setQueryData<PreferencesResponse>(queryKey, {
						preferences: applyPreferencesPatch(
							previous.preferences,
							patch
						),
						isPersisted: true,
					})
				} catch {
					/* invalid locale — ignore optimistic */
				}
			}
			return { previous }
		},
		onError: (_err, _patch, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(queryKey, ctx.previous)
			}
		},
		onSuccess: (data) => {
			queryClient.setQueryData<PreferencesResponse>(queryKey, {
				preferences: data,
				isPersisted: true,
			})
		},
	})

	return {
		preferences: query.data?.preferences ?? DEFAULT_PREFERENCES,
		isPersisted: query.data?.isPersisted ?? false,
		isLoading: query.isLoading && isAuthenticated,
		isReady: !isAuthenticated || query.isSuccess || query.isError,
		isAuthenticated,
		updatePreferences: mutation.mutateAsync,
		isUpdating: mutation.isPending,
	}
}

export function PreferencesThemeSync() {
	const { preferences, isAuthenticated, isReady, isPersisted } =
		useUserPreferences()
	const { setTheme, theme } = useTheme()
	const appliedTheme = useRef<string | null>(null)

	useEffect(() => {
		if (!isAuthenticated || !isReady || !isPersisted) return
		const wanted = preferences.ui.theme
		if (appliedTheme.current === wanted) return
		if (theme !== wanted) {
			setTheme(wanted)
		}
		appliedTheme.current = wanted
	}, [
		isAuthenticated,
		isReady,
		isPersisted,
		preferences.ui.theme,
		setTheme,
		theme,
	])

	return null
}
