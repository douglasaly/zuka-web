import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import { cn } from '@/lib/utils'
import type { InboxItem } from '@/types/messages'

dayjs.locale('pt')
function formatTimeAgo(date: string): string {
	const d = dayjs(date)
	const diffMin = dayjs().diff(d, 'minute')
	if (diffMin < 1) return 'agora'
	if (diffMin < 60) return `há ${diffMin} min`
	if (diffMin < 1440) return d.format('HH:mm')
	if (diffMin < 1440 * 7) return d.format('ddd')
	return d.format('DD/MM/YY')
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
			? `Tu: ${conversation.lastMessage}`
			: conversation.lastMessage
		: 'Abre para escrever à loja'
	return (
		<Link
			href={`/mensagens/${conversation.conversationId}`}
			className={cn(
				'group flex min-h-18 w-full items-center gap-3 rounded-xl border bg-card p-4 py-5',
				'transition-[border-color,box-shadow,background-color,transform] duration-200',
				'hover:border-secondary/35 hover:bg-secondary/[0.03] hover:shadow-[0_8px_24px_-12px_color-mix(in_oklch,#e8340a_35%,transparent)]',
				'active:scale-[0.995]',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
				isUnread && 'border-secondary/25 bg-secondary/[0.04]'
			)}
		>
			<div className='relative shrink-0'>
				<StoreAvatar
					imageUrl={conversation.store.logoUrl ?? '/placeholder.png'}
					name={conversation.store.name}
					size='lg'
					className={cn(
						'ring-2 ring-background transition-shadow',
						isUnread && 'ring-secondary/30'
					)}
				/>
				{isUnread ? (
					<span
						className='absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold leading-none text-secondary-foreground shadow-sm ring-2 ring-card'
						aria-label={`${conversation.unreadCount} não lida${conversation.unreadCount === 1 ? '' : 's'}`}
					>
						{conversation.unreadCount > 9
							? '9+'
							: conversation.unreadCount}
					</span>
				) : null}
			</div>

			<div className='ml-1 flex min-w-0 flex-1 flex-col justify-center gap-0.5'>
				<div className='flex min-w-0 items-baseline justify-between gap-2'>
					<h3
						className={cn(
							'truncate text-sm leading-tight',
							isUnread ? 'font-bold' : 'font-semibold'
						)}
					>
						{conversation.store.name}
					</h3>
					{timeAgo ? (
						<time
							dateTime={conversation.lastMessageAt ?? undefined}
							className={cn(
								'shrink-0 text-[11px] tabular-nums',
								isUnread
									? 'font-semibold text-secondary'
									: 'text-muted-foreground'
							)}
						>
							{timeAgo}
						</time>
					) : null}
				</div>

				<p
					className={cn(
						'line-clamp-1 text-xs leading-relaxed',
						isUnread
							? 'font-medium text-foreground'
							: 'text-muted-foreground'
					)}
				>
					{lastMessageText}
				</p>
			</div>

			<ChevronRight
				className={cn(
					'size-5 shrink-0 transition-transform duration-200',
					'text-muted-foreground/50 group-hover:translate-x-0.5 group-hover:text-secondary'
				)}
				aria-hidden
			/>
		</Link>
	)
}
