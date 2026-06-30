import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import type { Conversation } from '../../constants'

type ConversationItemProps = {
	conversation: Conversation
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
	const isUnread = conversation.unreadCount > 0

	return (
		<Link
			href={`/mensagens/${conversation.id}`}
			className='flex h-18 w-full items-center gap-2 rounded-xl border bg-white p-4 py-8 transition-all duration-200 hover:scale-101 hover:shadow-md'
		>
			<div className='relative shrink-0'>
				<StoreAvatar
					imageUrl={conversation.storeAvatarUrl}
					name={conversation.storeName}
					size='lg'
				/>

				{isUnread && (
					<span className='absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] text-white'>
						{conversation.unreadCount}
					</span>
				)}
			</div>

			<div className='ml-3 flex flex-1 min-w-0 flex-col justify-center space-y-1'>
				<h3
					className={`text-md leading-tight ${
						isUnread ? 'font-bold' : 'font-semibold'
					}`}
				>
					{conversation.storeName}
				</h3>

				<div
					className={`text-xs leading-tight line-clamp-1 ${
						isUnread
							? 'font-medium text-foreground'
							: 'text-muted-foreground'
					}`}
				>
					{conversation.lastMessage}
				</div>
			</div>

			<div className='shrink-0 text-xs text-muted-foreground'>
				{conversation.timestamp}
			</div>
		</Link>
	)
}
