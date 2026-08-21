'use client'
import { Inbox } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadMoreMessages } from '@/modules/messages/ui/components/load-more-messages'
import { SellerInboxRow } from '@/modules/seller/ui/components/messages/seller-inbox-row'
import { SellerInboxRailHeader } from '@/modules/seller/ui/components/messages/seller-messages-headers'
import type { SellerConversation } from '@/types'

type SellerConversationInboxRailProps = {
	activeId: string
	inbox: SellerConversation[]
	inboxLoading: boolean
	hasMoreInbox: boolean
	isFetchingMoreInbox: boolean
	onLoadMore: () => void
}
export function SellerConversationInboxRail({
	activeId,
	inbox,
	inboxLoading,
	hasMoreInbox,
	isFetchingMoreInbox,
	onLoadMore,
}: SellerConversationInboxRailProps) {
	return (
		<aside className='hidden w-80 shrink-0 flex-col border-r border-border/60 bg-card lg:flex xl:w-96'>
			<SellerInboxRailHeader
				subtitle={`${inbox.length}${hasMoreInbox ? '+' : ''} conversa${inbox.length === 1 ? '' : 's'}`}
			/>
			<div className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
				{inboxLoading ? (
					<div className='divide-y divide-border/50'>
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className='flex items-center gap-3 px-4 py-3'
							>
								<Skeleton className='size-10 rounded-full' />
								<div className='flex-1 space-y-1.5'>
									<Skeleton className='h-3.5 w-28' />
									<Skeleton className='h-3 w-40' />
								</div>
							</div>
						))}
					</div>
				) : inbox.length === 0 ? (
					<div className='flex flex-col items-center px-4 py-12 text-center'>
						<Inbox className='size-6 text-muted-foreground' />
						<p className='mt-2 text-xs text-muted-foreground'>
							Sem conversas
						</p>
					</div>
				) : (
					<>
						<div className='divide-y divide-border/50'>
							{inbox.map((conv) => (
								<SellerInboxRow
									key={conv.id}
									conversation={conv}
									active={conv.id === activeId}
									compact
								/>
							))}
						</div>
						{hasMoreInbox ? (
							<div className='border-t border-border/50 py-3'>
								<LoadMoreMessages
									onLoadMore={onLoadMore}
									isLoading={isFetchingMoreInbox}
								/>
							</div>
						) : null}
					</>
				)}
			</div>
		</aside>
	)
}
