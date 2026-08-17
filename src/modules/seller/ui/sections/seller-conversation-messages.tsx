'use client'
import { MessageSquare } from 'lucide-react'
import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LoadMoreMessages } from '@/modules/messages/ui/components/load-more-messages'
import type { SellerConversationMessage } from '@/modules/seller/hooks/use-seller-conversation'
import {
	dayKey,
	dayLabel,
} from '@/modules/seller/ui/components/messages/message-day'
import { SellerMessageBubble } from '@/modules/seller/ui/components/messages/seller-message-bubble'

type SellerConversationMessagesProps = {
	scrollerRef: RefObject<HTMLDivElement | null>
	messages: SellerConversationMessage[]
	isLoading: boolean
	isError: boolean
	hasNextPage: boolean
	isFetchingNextPage: boolean
	onRetry: () => void
	onLoadOlder: () => void
}
export function SellerConversationMessages({
	scrollerRef,
	messages,
	isLoading,
	isError,
	hasNextPage,
	isFetchingNextPage,
	onRetry,
	onLoadOlder,
}: SellerConversationMessagesProps) {
	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-3 overflow-hidden p-4'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className={cn(
							'flex',
							i % 2 === 0 ? 'justify-start' : 'justify-end'
						)}
					>
						<Skeleton
							className={cn(
								'h-14 rounded-2xl',
								i % 2 === 0 ? 'w-52 max-w-[75%]' : 'w-40'
							)}
						/>
					</div>
				))}
			</div>
		)
	}
	if (isError) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center px-6 text-center'>
				<p className='font-heading text-base font-semibold'>
					Não foi possível carregar a conversa
				</p>
				<p className='mt-1 text-sm text-muted-foreground'>
					Verifique a ligação e tente outra vez.
				</p>
				<Button
					className='mt-4 rounded-full'
					variant='outline'
					size='sm'
					onClick={onRetry}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}
	if (messages.length === 0) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center px-6 text-center'>
				<div className='flex size-12 items-center justify-center rounded-2xl bg-muted/70'>
					<MessageSquare className='size-5 text-muted-foreground' />
				</div>
				<p className='mt-3 text-sm text-muted-foreground'>
					Sem mensagens ainda. Envie a primeira.
				</p>
			</div>
		)
	}
	return (
		<div
			ref={scrollerRef}
			className='min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5'
		>
			{hasNextPage ? (
				<div className='pb-2'>
					<LoadMoreMessages
						onLoadMore={onLoadOlder}
						isLoading={isFetchingNextPage}
					/>
				</div>
			) : null}
			{messages.map((msg, index) => {
				const isStore = msg.store_id !== null
				const prev = messages[index - 1]
				const showDay =
					!prev || dayKey(prev.created_at) !== dayKey(msg.created_at)
				return (
					<div key={msg.id}>
						{showDay ? (
							<div className='flex justify-center py-3'>
								<span className='rounded-full bg-muted/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground'>
									{dayLabel(msg.created_at)}
								</span>
							</div>
						) : null}
						<SellerMessageBubble
							content={msg.content}
							createdAt={msg.created_at}
							isStore={isStore}
						/>
					</div>
				)
			})}
			<div aria-hidden className='h-px' />
		</div>
	)
}
