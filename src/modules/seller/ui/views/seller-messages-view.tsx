'use client'

/**
 * THESIS: Inbox as a scannable work queue — unread weight, search, one panel;
 * refuses card-per-thread stacks and dead chrome.
 * OWN-WORLD: Seller Operate (rounded-2xl, meta, list divide grammar).
 * STORY: Find buyer → open thread → reply.
 * FIRST VIEWPORT: Count + filters + unified list (desktop: master–detail shell).
 * FORM: Extend seller dashboard Operate surface.
 * ADAPT: Mobile stacked list; lg+ list + empty detail pane (same shell as thread).
 */

import {
	SELLER_MESSAGES_SHELL,
	useSellerMessages,
} from '@/modules/seller/hooks/use-seller-messages'
import { SellerInboxRailHeader } from '../components/messages/seller-messages-headers'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'
import { SellerMessagesDetailPane } from '../sections/seller-messages-detail-pane'
import {
	SellerMessagesEmptyInbox,
	SellerMessagesError,
	SellerMessagesLoading,
} from '../sections/seller-messages-gates'
import { SellerMessagesListBody } from '../sections/seller-messages-list-body'
import { SellerMessagesToolbar } from '../sections/seller-messages-toolbar'

export const SellerMessagesView = () => {
	useSetSellerPageMeta({
		title: 'Mensagens',
		crumbs: ['Dashboard', 'Mensagens'],
	})

	const m = useSellerMessages()

	if (m.isLoading) {
		return <SellerMessagesLoading />
	}

	if (m.isError) {
		return <SellerMessagesError onRetry={() => m.refetch()} />
	}

	if (m.conversations.length === 0) {
		return <SellerMessagesEmptyInbox />
	}

	return (
		<div className={SELLER_MESSAGES_SHELL}>
			<div className='flex min-h-0 w-full flex-1 flex-col bg-card lg:w-80 lg:flex-none lg:border-r lg:border-border/60 xl:w-96'>
				<SellerInboxRailHeader subtitle={m.subtitle} />
				<SellerMessagesToolbar
					query={m.query}
					onQueryChange={m.setQuery}
					filter={m.filter}
					onFilterChange={m.setFilter}
					unreadCount={m.unreadCount}
				/>
				<SellerMessagesListBody
					visible={m.visible}
					query={m.query}
					filter={m.filter}
					onClearFilters={m.clearFilters}
					showLoadMore={m.showLoadMore}
					isFetchingNextPage={m.isFetchingNextPage}
					onLoadMore={() => void m.fetchNextPage()}
				/>
			</div>

			<SellerMessagesDetailPane />
		</div>
	)
}
