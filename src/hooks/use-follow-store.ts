import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	followStore, isFollowing,
	unfollowStore
} from '@/lib/api/stores'

export function useFollowStore(storeSlug: string) {
	const queryClient = useQueryClient()

	const { data: isFollowingState, isLoading: initialLoading } = useQuery({
		queryKey: ['store-follow', storeSlug],
		queryFn: () => isFollowing(storeSlug),
		enabled: !!storeSlug,
		staleTime: 1000 * 60 * 5,
	})

	const followMutation = useMutation({
		mutationFn: () => followStore(storeSlug),

		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ['store-follow', storeSlug],
			})

			const previous = queryClient.getQueryData<boolean>([
				'store-follow',
				storeSlug,
			])

			queryClient.setQueryData(['store-follow', storeSlug], true)

			return { previous }
		},

		onError: (_err, _vars, context) => {
			queryClient.setQueryData(
				['store-follow', storeSlug],
				context?.previous
			)
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['store-follow', storeSlug],
			})

			queryClient.invalidateQueries({
				queryKey: ['followed-stores'],
			})
		},
	})

	const unfollowMutation = useMutation({
		mutationFn: () => unfollowStore(storeSlug),

		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ['store-follow', storeSlug],
			})

			const previous = queryClient.getQueryData<boolean>([
				'store-follow',
				storeSlug,
			])

			queryClient.setQueryData(['store-follow', storeSlug], false)

			return { previous }
		},

		onError: (_err, _vars, context) => {
			queryClient.setQueryData(
				['store-follow', storeSlug],
				context?.previous
			)
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['store-follow', storeSlug],
			})

			queryClient.invalidateQueries({
				queryKey: ['followed-stores'],
			})
		},
	})

	const toggleFollow = () => {
		if (isFollowingState) {
			unfollowMutation.mutate()
		} else {
			followMutation.mutate()
		}
	}

	return {
		// state
		isFollowing: isFollowingState ?? false,
		isLoading: initialLoading,
		isFollowLoading: followMutation.isPending || unfollowMutation.isPending,
		// actions
		follow: followMutation.mutate,
		unfollow: unfollowMutation.mutate,
		toggleFollow,
	}
}
