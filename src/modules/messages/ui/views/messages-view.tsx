'use client'

import { useState } from 'react'
import { MOCK_CONVERSATIONS } from '../../constants'
import { ConversationsList } from '../components/conversation-list'
import { LoadMoreMessages } from '../components/load-more-messages'
import { MessagesHeader } from '../components/messages-header'
import { MessagesSkeleton } from '../components/messages-skeleton'

export const MessagesView = () => {
	const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)

	const unreadCount = conversations.filter((c) => c.unreadCount > 0).length

	const handleLoadMore = async () => {
		setIsLoadingMore(true)
		// TODO: buscar próxima página de conversas na API
		await new Promise((r) => setTimeout(r, 600))
		setIsLoadingMore(false)
	}

	return (
		<div className='mb-10 w-full min-w-0 px-4'>
			<main className='flex flex-col gap-4 space-y-4 px-4'>
				<MessagesHeader count={unreadCount} />

				{isLoading ? (
					<MessagesSkeleton />
				) : (
					<div className='space-y-4 md:px-8 pt-24'>
						<ConversationsList conversations={conversations} />

						{conversations.length > 0 && (
							<LoadMoreMessages
								onLoadMore={handleLoadMore}
								isLoading={isLoadingMore}
							/>
						)}
					</div>
				)}
			</main>
		</div>
	)
}
