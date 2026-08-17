'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useConversation } from '@/hooks/use-conversation'
import { ChatHeader } from '../components/chats/chat-header'
import { ChatHeaderSkeleton } from '../components/chats/chat-header-skeleton'
import { ChatInput } from '../components/chats/chat-input'
import { ChatMessagesList } from '../components/chats/chat-list'
import { ChatSkeleton } from '../components/chats/chat-skeleton'

interface MessageViewProps {
	messageId: string
}
export const MessageView = ({ messageId }: MessageViewProps) => {
	const {
		messages,
		isLoading,
		conversation,
		sendMessage,
		sendError,
		markRead,
	} = useConversation({
		conversationId: messageId,
	})
	useEffect(() => {
		markRead()
	}, [markRead])
	useEffect(() => {
		if (sendError) {
			toast.error('Falha ao enviar mensagem. Tenta novamente.')
		}
	}, [sendError])
	return (
		<div className='w-full min-w-0'>
			{!conversation?.store ? (
				<ChatHeaderSkeleton />
			) : (
				<ChatHeader
					storeName={conversation.store.name}
					storeAvatarUrl={
						conversation.store.logoUrl ?? '/placeholder.png'
					}
					storeLocation={[
						conversation.store.provinceName,
						conversation.store.state,
					]
						.filter(Boolean)
						.join(' • ')}
					storeSlug={conversation.store.slug}
				/>
			)}

			<div className='flex h-screen flex-col'>
				{isLoading ? (
					<ChatSkeleton />
				) : (
					<ChatMessagesList messages={messages} />
				)}

				<ChatInput onSend={sendMessage} />
			</div>
		</div>
	)
}
