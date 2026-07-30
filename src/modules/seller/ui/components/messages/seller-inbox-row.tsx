'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import Link from 'next/link'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'

dayjs.locale('pt')

export type SellerConversation = {
	id: string
	otherUserName: string
	otherUserAvatar: string | null
	lastMessage: string | null
	lastMessageAt: string | null
	unread: boolean
}

export function formatInboxTime(iso: string): string {
	const d = dayjs(iso)
	const diffMin = dayjs().diff(d, 'minute')
	if (diffMin < 1) return 'agora'
	if (diffMin < 60) return `há ${diffMin} min`
	if (diffMin < 1440) return d.format('HH:mm')
	if (diffMin < 1440 * 7) return d.format('ddd')
	return d.format('DD/MM/YY')
}

type SellerInboxRowProps = {
	conversation: SellerConversation
	active?: boolean
	baseHref?: string
	compact?: boolean
}

export function SellerInboxRow({
	conversation,
	active = false,
	baseHref = '/dashboard/seller/mensagens',
	compact = false,
}: SellerInboxRowProps) {
	const time = conversation.lastMessageAt
		? formatInboxTime(conversation.lastMessageAt)
		: null

	return (
		<Link
			href={`${baseHref}/${conversation.id}`}
			className={cn(
				'flex min-h-14 min-w-0 items-center gap-3 px-3.5 transition-colors duration-150 sm:px-4',
				compact ? 'py-2.5' : 'py-3',
				'hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none',
				'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset',
				active && 'bg-muted/60',
				conversation.unread && !active && 'bg-primary/5'
			)}
		>
			<div className='relative shrink-0'>
				<UserAvatar
					name={conversation.otherUserName}
					imageUrl={conversation.otherUserAvatar}
					size={compact ? 'default' : 'lg'}
					fClassName='text-xs font-semibold'
				/>
				{conversation.unread ? (
					<span
						className='absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card'
						aria-label='Não lida'
					/>
				) : null}
			</div>
			<div className='min-w-0 flex-1'>
				<div className='flex min-w-0 items-baseline justify-between gap-2'>
					<p
						className={cn(
							'truncate text-sm',
							conversation.unread
								? 'font-semibold'
								: 'font-medium'
						)}
					>
						{conversation.otherUserName}
					</p>
					{time ? (
						<span
							className={cn(
								'shrink-0 text-[11px] tabular-nums',
								conversation.unread
									? 'font-medium text-foreground'
									: 'text-muted-foreground'
							)}
						>
							{time}
						</span>
					) : null}
				</div>
				<p
					className={cn(
						'mt-0.5 line-clamp-1 text-xs leading-relaxed',
						conversation.unread
							? 'font-medium text-foreground/80'
							: 'text-muted-foreground'
					)}
				>
					{conversation.lastMessage ?? 'Sem mensagens'}
				</p>
			</div>
		</Link>
	)
}
