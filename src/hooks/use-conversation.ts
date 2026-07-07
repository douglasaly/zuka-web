'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@/modules/messages/constants'

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
	return data
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
	return data
}

async function markConversationRead(conversationId: string): Promise<void> {
	const res = await fetch(`/api/conversations/${conversationId}/read`, {
		method: 'PATCH',
		credentials: 'include',
	})
	if (!res.ok) throw new Error('Failed to mark as read')
}

export const useConversation = ({ conversationId }: UseConversationProps) => {
	const queryClient = useQueryClient()

	const { data: messages = [], isLoading } = useQuery({
		queryKey: MESSAGES_KEY(conversationId),
		queryFn: () => fetchMessages(conversationId),
		refetchInterval: 3000,
	})

	const markRead = useMutation({
		mutationFn: () => markConversationRead(conversationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['inbox'] })
		},
	})

	const sendMessage = useMutation({
		mutationFn: (content: string) => postMessage(conversationId, content),
		onSuccess: (newMessage) => {
			// actualização optimista — adiciona a mensagem imediatamente
			// sem esperar pelo refetch
			queryClient.setQueryData<ChatMessage[]>(
				MESSAGES_KEY(conversationId),
				(prev = []) => [...prev, newMessage]
			)
			queryClient.invalidateQueries({ queryKey: ['inbox'] })
			markRead.mutate()
		},
	})

	return {
		messages,
		isLoading,
		isSending: sendMessage.isPending,
		sendError: sendMessage.error,
		sendMessage: (text: string) => sendMessage.mutate(text),
		markRead: () => markRead.mutate(),
	}
}
