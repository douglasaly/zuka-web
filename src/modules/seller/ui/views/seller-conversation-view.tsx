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

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Inbox, Loader2, MessageSquare, Send } from 'lucide-react'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { flattenPages, useInfiniteList } from '@/hooks/use-infinite-list'
import { cn } from '@/lib/utils'
import { LoadMoreMessages } from '@/modules/messages/ui/components/load-more-messages'
import { formatTime } from '@/utils/format-time'
import { IconTooltipButton } from '../components/icon-tooltip-button'
import {
	type SellerConversation,
	SellerInboxRow,
} from '../components/messages/seller-inbox-row'
import {
	SellerInboxRailHeader,
	SellerThreadPeerHeader,
} from '../components/messages/seller-messages-headers'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

type Message = {
	id: string
	conversation_id: string
	user_id: string | null
	store_id: string | null
	content: string
	status: string
	created_at: string
}

function localDayKey(d: Date) {
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function dayKey(iso: string) {
	return localDayKey(new Date(iso))
}

function dayLabel(iso: string) {
	const d = new Date(iso)
	const today = new Date()
	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	if (dayKey(iso) === localDayKey(today)) return 'Hoje'
	if (dayKey(iso) === localDayKey(yesterday)) return 'Ontem'
	return d.toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric',
	})
}

const SHELL = '-m-4 flex h-[calc(100dvh-76px)] min-w-0 sm:-m-6'
const INBOX_LIMIT = 20
const MESSAGES_LIMIT = 30

type SellerConversationViewProps = {
	id: string
}

export const SellerConversationView = ({ id }: SellerConversationViewProps) => {
	const [input, setInput] = useState('')
	const scrollerRef = useRef<HTMLDivElement>(null)
	const queryClient = useQueryClient()

	const {
		data: inboxData,
		isLoading: inboxLoading,
		fetchNextPage: fetchMoreInbox,
		hasNextPage: hasMoreInbox,
		isFetchingNextPage: isFetchingMoreInbox,
	} = useInfiniteList<SellerConversation>({
		queryKey: ['seller-conversations'],
		endpoint: '/api/stores/conversations',
		limit: INBOX_LIMIT,
	})

	const inbox = flattenPages<SellerConversation>(inboxData)

	const peer = useMemo(
		() => inbox.find((c) => c.id === id) ?? null,
		[inbox, id]
	)

	const peerName = peer?.otherUserName ?? 'Cliente'

	useSetSellerPageMeta({
		title: 'Mensagens',
		crumbs: ['Dashboard', 'Mensagens'],
	})

	const {
		data: messagesData,
		isLoading,
		isError,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteList<Message>({
		queryKey: ['seller-conversation-messages', id],
		endpoint: `/api/stores/conversations/${id}/messages`,
		limit: MESSAGES_LIMIT,
	})

	// Pages are newest-first batches; reverse so older pages come first.
	const messages = useMemo(() => {
		const pages = messagesData?.pages ?? []
		return [...pages].reverse().flatMap((p) => p.data as Message[])
	}, [messagesData])

	const sendMutation = useMutation({
		mutationFn: async (content: string) => {
			const res = await fetch(
				`/api/stores/conversations/${id}/messages`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ content }),
				}
			)
			const json = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error(
					json.error?.message ??
						json.error ??
						'Falha ao enviar mensagem'
				)
			}
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['seller-conversation-messages', id],
			})
			queryClient.invalidateQueries({
				queryKey: ['seller-conversations'],
			})
			setInput('')
		},
		onError: (err: Error) => toast.error(err.message),
	})

	useEffect(() => {
		void (async () => {
			try {
				const res = await fetch(
					`/api/stores/conversations/${id}/read`,
					{ method: 'PATCH' }
				)
				if (!res.ok) return
				queryClient.invalidateQueries({
					queryKey: ['seller-conversations'],
				})
				queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
			} catch {
				/* silent */
			}
		})()
	}, [id, queryClient])

	const scrollToBottom = useCallback((smooth: boolean) => {
		const root = scrollerRef.current
		if (!root) return
		root.scrollTo({
			top: root.scrollHeight,
			behavior: smooth ? 'smooth' : 'auto',
		})
	}, [])

	const newestMessageId = messages[messages.length - 1]?.id

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll when conversation changes
	useLayoutEffect(() => {
		scrollToBottom(false)
	}, [id, scrollToBottom])

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-scroll on new newest message / send
	useEffect(() => {
		scrollToBottom(true)
	}, [newestMessageId, sendMutation.isPending, scrollToBottom])

	async function handleLoadOlder() {
		const root = scrollerRef.current
		const prevHeight = root?.scrollHeight ?? 0
		await fetchNextPage()
		requestAnimationFrame(() => {
			if (!root) return
			root.scrollTop = root.scrollHeight - prevHeight
		})
	}

	function handleSend() {
		const trimmed = input.trim()
		if (!trimmed || sendMutation.isPending) return
		sendMutation.mutate(trimmed)
	}

	return (
		<div className={SHELL}>
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
										active={conv.id === id}
										compact
									/>
								))}
							</div>
							{hasMoreInbox ? (
								<div className='border-t border-border/50 py-3'>
									<LoadMoreMessages
										onLoadMore={() => void fetchMoreInbox()}
										isLoading={isFetchingMoreInbox}
									/>
								</div>
							) : null}
						</>
					)}
				</div>
			</aside>

			<div className='flex min-w-0 flex-1 flex-col bg-background'>
				<SellerThreadPeerHeader
					leading={
						<span className='lg:hidden'>
							<IconTooltipButton
								label='Voltar às mensagens'
								size='icon'
								className='size-11'
								href='/dashboard/seller/mensagens'
							>
								<ArrowLeft className='size-4' />
							</IconTooltipButton>
						</span>
					}
					name={peerName}
					avatarUrl={peer?.otherUserAvatar}
					loading={!peer && inboxLoading}
				/>

				{isLoading ? (
					<div className='flex flex-1 flex-col gap-3 overflow-hidden p-4'>
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className={cn(
									'flex',
									i % 2 === 0
										? 'justify-start'
										: 'justify-end'
								)}
							>
								<Skeleton
									className={cn(
										'h-14 rounded-2xl',
										i % 2 === 0
											? 'w-52 max-w-[75%]'
											: 'w-40'
									)}
								/>
							</div>
						))}
					</div>
				) : isError ? (
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
							onClick={() => refetch()}
						>
							Tentar novamente
						</Button>
					</div>
				) : messages.length === 0 ? (
					<div className='flex flex-1 flex-col items-center justify-center px-6 text-center'>
						<div className='flex size-12 items-center justify-center rounded-2xl bg-muted/70'>
							<MessageSquare className='size-5 text-muted-foreground' />
						</div>
						<p className='mt-3 text-sm text-muted-foreground'>
							Sem mensagens ainda. Envie a primeira.
						</p>
					</div>
				) : (
					<div
						ref={scrollerRef}
						className='min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5'
					>
						{hasNextPage ? (
							<div className='pb-2'>
								<LoadMoreMessages
									onLoadMore={() => void handleLoadOlder()}
									isLoading={isFetchingNextPage}
								/>
							</div>
						) : null}
						{messages.map((msg, index) => {
							const isStore = msg.store_id !== null
							const prev = messages[index - 1]
							const showDay =
								!prev ||
								dayKey(prev.created_at) !==
									dayKey(msg.created_at)

							return (
								<div key={msg.id}>
									{showDay ? (
										<div className='flex justify-center py-3'>
											<span className='rounded-full bg-muted/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground'>
												{dayLabel(msg.created_at)}
											</span>
										</div>
									) : null}
									<div
										className={cn(
											'flex',
											isStore
												? 'justify-end'
												: 'justify-start'
										)}
									>
										<div
											className={cn(
												'max-w-[min(85%,28rem)] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed wrap-break-word shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:max-w-[min(75%,28rem)] sm:text-sm',
												isStore
													? 'rounded-br-md bg-foreground text-background'
													: 'rounded-bl-md border border-border/60 bg-card'
											)}
										>
											<p className='whitespace-pre-wrap'>
												{msg.content}
											</p>
											<p
												className={cn(
													'mt-1 text-right text-[10px] tabular-nums',
													isStore
														? 'text-background/55'
														: 'text-muted-foreground'
												)}
											>
												{formatTime(msg.created_at)}
											</p>
										</div>
									</div>
								</div>
							)
						})}
						<div aria-hidden className='h-px' />
					</div>
				)}

				<div className='shrink-0 border-t border-border/60 bg-card/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-4 sm:pt-4 sm:pb-4'>
					<form
						className='mx-auto flex max-w-3xl items-end gap-2'
						onSubmit={(e) => {
							e.preventDefault()
							handleSend()
						}}
					>
						<Textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									handleSend()
								}
							}}
							placeholder='Escreva uma mensagem…'
							rows={1}
							className='max-h-32 min-h-11 flex-1 resize-none rounded-2xl py-2.5 text-base sm:text-sm'
							disabled={sendMutation.isPending}
							aria-label='Mensagem'
							enterKeyHint='send'
						/>
						<IconTooltipButton
							label={
								sendMutation.isPending
									? 'A enviar…'
									: 'Enviar mensagem'
							}
							type='submit'
							size='icon'
							variant='default'
							className='size-11 shrink-0'
							disabled={!input.trim() || sendMutation.isPending}
						>
							{sendMutation.isPending ? (
								<Loader2 className='size-4 animate-spin' />
							) : (
								<Send className='size-4' />
							)}
						</IconTooltipButton>
					</form>
					<p className='mx-auto mt-1.5 hidden max-w-3xl text-[11px] text-muted-foreground sm:block'>
						Enter para enviar · Shift+Enter para nova linha
					</p>
				</div>
			</div>
		</div>
	)
}
