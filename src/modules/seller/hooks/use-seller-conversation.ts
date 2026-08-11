'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { toast } from 'sonner'
import { flattenPages, useInfiniteList } from '@/hooks/use-infinite-list'
import type { SellerConversation } from '@/modules/seller/ui/components/messages/seller-inbox-row'

export type SellerConversationMessage = {
	id: string
	conversation_id: string
	user_id: string | null
	store_id: string | null
	content: string
	status: string
	created_at: string
}

const INBOX_LIMIT = 20
const MESSAGES_LIMIT = 30

export function useSellerConversation(id: string) {
	const [input, setInput] = useState('')
	const scrollerRef = useRef<HTMLDivElement>(null)
	const queryClient = useQueryClient()

	const {
		data: inboxData,
		isLoading: inboxLoading,
		fetchNextPage: fetchMoreInbox,
		hasNextPage: hasMoreInbox,
		isFetchingNextPage: isFetchingMoreInbox,
	} = useInfiniteList<SellerConversation>({
		queryKey: ['seller-conversations'],
		endpoint: '/api/stores/conversations',
		limit: INBOX_LIMIT,
	})

	const inbox = flattenPages<SellerConversation>(inboxData)

	const peer = useMemo(
		() => inbox.find((c) => c.id === id) ?? null,
		[inbox, id]
	)

	const peerName = peer?.otherUserName ?? 'Cliente'

	const {
		data: messagesData,
		isLoading,
		isError,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteList<SellerConversationMessage>({
		queryKey: ['seller-conversation-messages', id],
		endpoint: `/api/stores/conversations/${id}/messages`,
		limit: MESSAGES_LIMIT,
	})

	// Pages are newest-first batches; reverse so older pages come first.
	const messages = useMemo(() => {
		const pages = messagesData?.pages ?? []
		return [...pages]
			.reverse()
			.flatMap((p) => p.data as SellerConversationMessage[])
	}, [messagesData])

	const sendMutation = useMutation({
		mutationFn: async (content: string) => {
			const res = await fetch(
				`/api/stores/conversations/${id}/messages`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ content }),
				}
			)
			const json = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error(
					json.error?.message ??
						json.error ??
						'Falha ao enviar mensagem'
				)
			}
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['seller-conversation-messages', id],
			})
			queryClient.invalidateQueries({
				queryKey: ['seller-conversations'],
			})
			setInput('')
		},
		onError: (err: Error) => toast.error(err.message),
	})

	useEffect(() => {
		void (async () => {
			try {
				const res = await fetch(
					`/api/stores/conversations/${id}/read`,
					{ method: 'PATCH' }
				)
				if (!res.ok) return
				queryClient.invalidateQueries({
					queryKey: ['seller-conversations'],
				})
				queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
			} catch {
				/* silent */
			}
		})()
	}, [id, queryClient])

	const scrollToBottom = useCallback((smooth: boolean) => {
		const root = scrollerRef.current
		if (!root) return
		root.scrollTo({
			top: root.scrollHeight,
			behavior: smooth ? 'smooth' : 'auto',
		})
	}, [])

	const newestMessageId = messages[messages.length - 1]?.id

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll when conversation changes
	useLayoutEffect(() => {
		scrollToBottom(false)
	}, [id, scrollToBottom])

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll on new newest message / send
	useEffect(() => {
		scrollToBottom(true)
	}, [newestMessageId, sendMutation.isPending, scrollToBottom])

	async function handleLoadOlder() {
		const root = scrollerRef.current
		const prevHeight = root?.scrollHeight ?? 0
		await fetchNextPage()
		requestAnimationFrame(() => {
			if (!root) return
			root.scrollTop = root.scrollHeight - prevHeight
		})
	}

	function handleSend() {
		const trimmed = input.trim()
		if (!trimmed || sendMutation.isPending) return
		sendMutation.mutate(trimmed)
	}

	return {
		id,
		input,
		setInput,
		scrollerRef,
		inbox,
		inboxLoading,
		fetchMoreInbox,
		hasMoreInbox,
		isFetchingMoreInbox,
		peer,
		peerName,
		messages,
		isLoading,
		isError,
		refetch,
		hasNextPage,
		isFetchingNextPage,
		sendMutation,
		handleLoadOlder,
		handleSend,
	}
}
