'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@/modules/messages/constants'

type ApiMessage = {
	id: string
	conversation_id: string
	user_id: string | null
	store_id: string | null
	content: string
	status: string
	created_at: string
	updated_at: string | null
	deleted_at: string | null
}

function mapApiMessage(msg: ApiMessage): ChatMessage {
	return {
		id: msg.id,
		conversationId: msg.conversation_id,
		userId: msg.user_id,
		storeId: msg.store_id,
		content: msg.content,
		status: msg.status as ChatMessage['status'],
		createdAt: msg.created_at,
		updatedAt: msg.updated_at ?? '',
		deletedAt: msg.deleted_at,
	}
}

type UseConversationProps = {
	conversationId: string
}

const MESSAGES_KEY = (id: string) => ['messages', id]

async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
	const res = await fetch(`/api/conversations/${conversationId}/messages`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to fetch messages')
	const { data } = await res.json()
	return (data ?? []).map(mapApiMessage)
}

async function postMessage(
	conversationId: string,
	content: string
): Promise<ChatMessage> {
	const res = await fetch(`/api/conversations/${conversationId}/messages`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content }),
	})
	if (!res.ok) throw new Error('Failed to send message')
	const { data } = await res.json()
	return mapApiMessage(data)
}

async function markConversationRead(conversationId: string): Promise<void> {
	const res = await fetch(`/api/conversations/${conversationId}/read`, {
		method: 'PATCH',
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to mark as read')
}

export type ConversationStore = {
	id: string
	name: string
	logoUrl: string | null
	slug: string
	state: string | null
	provinceName: string | null
}

export type ConversationDetails = {
	conversationId: string
	productId: string | null
	store: ConversationStore | null
}

const CONVERSATION_KEY = (id: string) => ['conversation', id]

async function fetchConversation(
	conversationId: string
): Promise<ConversationDetails> {
	const res = await fetch(`/api/conversations/${conversationId}`, {
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to fetch conversation')
	const { data } = await res.json()
	return data
}

export const useConversation = ({ conversationId }: UseConversationProps) => {
	const queryClient = useQueryClient()

	const { data: messages = [], isLoading } = useQuery({
		queryKey: MESSAGES_KEY(conversationId),
		queryFn: () => fetchMessages(conversationId),
		refetchInterval: 3000,
	})

	const { data: conversation } = useQuery({
		queryKey: CONVERSATION_KEY(conversationId),
		queryFn: () => fetchConversation(conversationId),
	})

	const markRead = useMutation({
		mutationFn: () => markConversationRead(conversationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['inbox'] })
		},
	})

	const sendMessage = useMutation<
		ChatMessage,
		Error,
		string,
		{ previous: ChatMessage[]; tempId: string }
	>({
		mutationFn: (content: string) => postMessage(conversationId, content),
		onMutate: async (content) => {
			await queryClient.cancelQueries({
				queryKey: MESSAGES_KEY(conversationId),
			})

			const previous =
				queryClient.getQueryData<ChatMessage[]>(
					MESSAGES_KEY(conversationId)
				) ?? []

			const tempId = `temp-${Date.now()}`
			const optimisticMessage: ChatMessage = {
				id: tempId,
				conversationId,
				userId: 'pending',
				storeId: null,
				content,
				status: 'sent',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				deletedAt: null,
			}

			queryClient.setQueryData<ChatMessage[]>(
				MESSAGES_KEY(conversationId),
				(prev = []) => [...prev, optimisticMessage]
			)

			return { previous, tempId }
		},
		onSuccess: (newMessage, _content, context) => {
			queryClient.setQueryData<ChatMessage[]>(
				MESSAGES_KEY(conversationId),
				(prev = []) =>
					prev?.map((m) =>
						m.id === context?.tempId
							? { ...newMessage, status: 'delivered' as const }
							: m
					) ?? []
			)
			queryClient.invalidateQueries({ queryKey: ['inbox'] })
			markRead.mutate()
		},
		onError: (_err, _content, context) => {
			if (context) {
				queryClient.setQueryData<ChatMessage[]>(
					MESSAGES_KEY(conversationId),
					context.previous
				)
			}
		},
	})

	return {
		messages,
		isLoading,
		conversation,
		isSending: sendMessage.isPending,
		sendError: sendMessage.error,
		sendMessage: sendMessage.mutate,
		markRead: markRead.mutate,
	}
}
