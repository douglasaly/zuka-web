'use client'

import { useState } from 'react'
import { type ChatMessage, MOCK_MESSAGES } from '../../constants'
import { ChatHeader } from '../components/chats/chat-header'
import { ChatInput } from '../components/chats/chat-input'
import { ChatMessagesList } from '../components/chats/chat-list'
import { ChatSkeleton } from '../components/chats/chat-skeleton'

interface MessageViewProps {
	messageId: string
}

export const MessageView = ({ messageId }: MessageViewProps) => {
	const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
	const [isLoading] = useState(false)

	const handleSend = (text: string) => {
		const newMessage: ChatMessage = {
			id: Date.now(),
			sender: 'user',
			text,
			time: new Date().toLocaleTimeString('pt-PT', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		}

		setMessages((prev) => [...prev, newMessage])
		// TODO: enviar mensagem para a API usando messageId
	}

	return (
		<div className='w-full min-w-0'>
			<ChatHeader
				storeName='Loja da Fátima'
				storeAvatarUrl='/placeholder.jpg'
				storeLocation='Maputo • Sommerchild'
			/>

			<div className='flex h-screen flex-col'>
				{isLoading ? (
					<ChatSkeleton />
				) : (
					<ChatMessagesList messages={messages} />
				)}

				<ChatInput onSend={handleSend} />
			</div>
		</div>
	)
}
