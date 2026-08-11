'use client'

/**
 * THESIS: Thread as a focused reply surface — buyer identity leads, bubbles
 * scan by side, composer stays reachable; refuses anonymous "Conversa" chrome.
 * OWN-WORLD: Seller Operate + inbox list grammar; desktop split fills the void.
 * STORY: Read buyer thread → reply → stay in flow.
 * FIRST VIEWPORT: Header + messages + composer (list alongside on lg).
 * FORM: Extend seller inbox Operate surface.
 * ADAPT: Fixed viewport height, safe-area composer, touch targets, internal scroll.
 */

import { useSellerConversation } from '@/modules/seller/hooks/use-seller-conversation'
import { SellerConversationComposer } from '@/modules/seller/ui/sections/seller-conversation-composer'
import { SellerConversationHeader } from '@/modules/seller/ui/sections/seller-conversation-header'
import { SellerConversationInboxRail } from '@/modules/seller/ui/sections/seller-conversation-inbox-rail'
import { SellerConversationMessages } from '@/modules/seller/ui/sections/seller-conversation-messages'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

const SHELL = '-m-4 flex h-[calc(100dvh-76px)] min-w-0 sm:-m-6'

type SellerConversationViewProps = {
	id: string
}

export const SellerConversationView = ({ id }: SellerConversationViewProps) => {
	useSetSellerPageMeta({
		title: 'Mensagens',
		crumbs: ['Dashboard', 'Mensagens'],
	})

	const c = useSellerConversation(id)

	return (
		<div className={SHELL}>
			<SellerConversationInboxRail
				activeId={c.id}
				inbox={c.inbox}
				inboxLoading={c.inboxLoading}
				hasMoreInbox={c.hasMoreInbox}
				isFetchingMoreInbox={c.isFetchingMoreInbox}
				onLoadMore={() => void c.fetchMoreInbox()}
			/>

			<div className='flex min-w-0 flex-1 flex-col bg-background'>
				<SellerConversationHeader
					peerName={c.peerName}
					avatarUrl={c.peer?.otherUserAvatar}
					loading={!c.peer && c.inboxLoading}
				/>

				<SellerConversationMessages
					scrollerRef={c.scrollerRef}
					messages={c.messages}
					isLoading={c.isLoading}
					isError={c.isError}
					hasNextPage={Boolean(c.hasNextPage)}
					isFetchingNextPage={c.isFetchingNextPage}
					onRetry={() => c.refetch()}
					onLoadOlder={() => void c.handleLoadOlder()}
				/>

				<SellerConversationComposer
					input={c.input}
					onInputChange={c.setInput}
					onSend={c.handleSend}
					isPending={c.sendMutation.isPending}
				/>
			</div>
		</div>
	)
}
