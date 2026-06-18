'use client'

import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'

export function useSyncUser() {
	const trpc = useTRPC()
	return useMutation(trpc.auth.syncUser.mutationOptions())
}
