import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import type { InboxItem } from '@/types/messages'

type ConversationItemProps = {
	conversation: InboxItem
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
	const isUnread = conversation.unreadCount > 0

	const timeAgo = conversation.lastMessageAt
		? formatDistanceToNow(new Date(conversation.lastMessageAt), {
				addSuffix: false,
				locale: pt,
			})
		: null

	const lastMessageText = conversation.lastMessage
		? conversation.isLastMessageMine
			? `Você: ${conversation.lastMessage}`
			: conversation.lastMessage
		: null

	return (
		<Link
			href={`/mensagens/${conversation.conversationId}`}
			className='flex h-18 w-full items-center gap-2 rounded-xl border bg-white p-4 py-8 transition-all duration-200 hover:scale-101 hover:shadow-md'
		>
			<div className='relative shrink-0'>
				<StoreAvatar
					imageUrl={conversation.store.logoUrl ?? '/placeholder.jpg'}
					name={conversation.store.name}
					size='lg'
				/>

				{isUnread && (
					<span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] text-white'>
						{conversation.unreadCount}
					</span>
				)}
			</div>

			<div className='ml-3 flex min-w-0 flex-1 flex-col justify-center space-y-1'>
				<h3
					className={`text-md leading-tight ${
						isUnread ? 'font-bold' : 'font-semibold'
					}`}
				>
					{conversation.store.name}
				</h3>

				{lastMessageText && (
					<div
						className={`line-clamp-1 text-xs leading-tight ${
							isUnread
								? 'font-medium text-foreground'
								: 'text-muted-foreground'
						}`}
					>
						{lastMessageText}
					</div>
				)}
			</div>

			{timeAgo && (
				<div className='shrink-0 text-xs text-muted-foreground'>
					{timeAgo}
				</div>
			)}
		</Link>
	)
}
