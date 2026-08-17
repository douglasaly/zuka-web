'use client'
import { useInbox } from '@/hooks/use-inbox'
import { ConversationsList } from '../components/conversation-list'
import { LoadMoreMessages } from '../components/load-more-messages'
import { MessagesHeader } from '../components/messages-header'
import { MessagesSkeleton } from '../components/messages-skeleton'
export const MessagesView = () => {
	const { conversations, isLoading, unreadTotal, hasMore } = useInbox()
	const handleLoadMore = async () => {}
	return (
		<div className='mb-10 w-full min-w-0'>
			<main className='flex flex-col px-4'>
				<MessagesHeader count={unreadTotal} />

				{isLoading ? (
					<MessagesSkeleton />
				) : (
					<div className='w-full space-y-4 pt-24'>
						<ConversationsList conversations={conversations} />

						{hasMore ? (
							<LoadMoreMessages
								onLoadMore={handleLoadMore}
								isLoading={false}
							/>
						) : null}
					</div>
				)}
			</main>
		</div>
	)
}
