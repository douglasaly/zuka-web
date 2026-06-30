import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'

import {
	CreateSavedItem,
	DeleteSavedItem,
	FetchSavedItems,
} from '@/lib/api/saved-items'

import { useUserProfile } from './use-user-profile'

export function useSavedItems() {
	const queryClient = useQueryClient()

	const { isAuthenticated, isLoading: isAuthLoading } = useUserProfile()

	const { data: savedItems = [], isLoading: isSavedItemsLoading } = useQuery({
		queryKey: ['saved-items'],
		queryFn: FetchSavedItems,
		enabled: isAuthenticated && !isAuthLoading,
		staleTime: 1000 * 60 * 5,
	})

	const savedSet = useMemo(() => {
		return new Set(savedItems.map((item) => item.id))
	}, [savedItems])

	const isSaved = (productId: string) => {
		return savedSet.has(productId)
	}

	const createItem = useMutation({
		mutationFn: CreateSavedItem,

		onSuccess: () => {
			toast.success('Adicionado aos favoritos')
			queryClient.invalidateQueries({ queryKey: ['saved-items'] })
		},
		onError: () => {
			toast.error('Falha ao salvar')
		},
	})

	const deleteItem = useMutation({
		mutationFn: DeleteSavedItem,
		onSuccess: () => {
			toast.success('Removido dos favoritos')
			queryClient.invalidateQueries({ queryKey: ['saved-items'] })
		},
		onError: () => {
			toast.error('Falha ao remover')
		},
	})

	// ✔ TOGGLE (core)
	const toggleSavedItem = (productId: string) => {
		if (isSaved(productId)) {
			deleteItem.mutate(productId)
		} else {
			createItem.mutate(productId)
		}
	}

	return {
		savedItems,
		isSavedItemsLoading,

		isSaved,

		toggleSavedItem,

		isSaving: createItem.isPending,
		isRemoving: deleteItem.isPending,
	}
}
