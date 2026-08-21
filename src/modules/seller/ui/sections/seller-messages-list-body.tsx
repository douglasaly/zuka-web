'use client'
import { Button } from '@/components/ui/button'
import { LoadMoreMessages } from '@/modules/messages/ui/components/load-more-messages'
import type { SellerMessagesFilter } from '../../hooks/use-seller-messages'
import { SellerInboxRow } from '../components/messages/seller-inbox-row'
import type { SellerConversation } from '@/types'

type SellerMessagesListBodyProps = {
	visible: SellerConversation[]
	query: string
	filter: SellerMessagesFilter
	onClearFilters: () => void
	showLoadMore: boolean
	isFetchingNextPage: boolean
	onLoadMore: () => void
}
export function SellerMessagesListBody({
	visible,
	query,
	filter,
	onClearFilters,
	showLoadMore,
	isFetchingNextPage,
	onLoadMore,
}: SellerMessagesListBodyProps) {
	if (visible.length === 0) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center px-6 py-12 text-center'>
				<p className='text-sm text-muted-foreground'>
					Nenhuma conversa corresponde à pesquisa.
				</p>
				{(query || filter !== 'all') && (
					<Button
						variant='ghost'
						size='sm'
						className='mt-3 rounded-full'
						onClick={onClearFilters}
					>
						Limpar filtros
					</Button>
				)}
			</div>
		)
	}
	return (
		<div className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
			<div className='divide-y divide-border/50'>
				{visible.map((conv) => (
					<SellerInboxRow key={conv.id} conversation={conv} />
				))}
			</div>
			{showLoadMore ? (
				<div className='border-t border-border/50 py-3'>
					<LoadMoreMessages
						onLoadMore={onLoadMore}
						isLoading={isFetchingNextPage}
					/>
				</div>
			) : null}
		</div>
	)
}
