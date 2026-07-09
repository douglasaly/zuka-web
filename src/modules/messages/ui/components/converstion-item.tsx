import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import type { InboxItem } from '@/types/messages'

dayjs.extend(relativeTime)
dayjs.locale('pt')

function formatTimeAgo(date: string): string {
	const d = dayjs(date)
	const diffMin = dayjs().diff(d, 'minute')

	if (diffMin < 1) return `há ${dayjs().diff(d, 'second')} seg`
	if (diffMin < 60) return `há ${diffMin} min`
	if (diffMin < 120) return `há ${Math.floor(diffMin / 60)} hora`
	if (diffMin < 1440) return d.format('HH:mm')
	if (diffMin < 43200)
		return `há ${Math.floor(diffMin / 1440)} dia${Math.floor(diffMin / 1440) > 1 ? 's' : ''}`
	if (diffMin < 525600)
		return `há ${Math.floor(diffMin / 43200)} mês${Math.floor(diffMin / 43200) > 1 ? 'es' : ''}`

	return `há ${Math.floor(diffMin / 525600)} ano${Math.floor(diffMin / 525600) > 1 ? 's' : ''}`
}

type ConversationItemProps = {
	conversation: InboxItem
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
	const isUnread = conversation.unreadCount > 0

	const timeAgo = conversation.lastMessageAt
		? formatTimeAgo(conversation.lastMessageAt)
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
					imageUrl={conversation.store.logoUrl ?? '/placeholder.png'}
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
					className={`truncate text-md leading-tight ${
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
				<div className='max-w-[120px] shrink-0 truncate text-right text-xs text-muted-foreground'>
					{timeAgo}
				</div>
			)}
		</Link>
	)
}
