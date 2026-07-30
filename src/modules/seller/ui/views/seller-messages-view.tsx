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

import { useQuery } from '@tanstack/react-query'
import { Inbox, MessageSquare, Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
	type SellerConversation,
	SellerInboxRow,
} from '../components/messages/seller-inbox-row'
import {
	SellerInboxRailHeader,
	SellerThreadPlaceholderHeader,
} from '../components/messages/seller-messages-headers'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

type Filter = 'all' | 'unread'

const SHELL =
	'-m-4 flex h-[calc(100dvh-76px)] min-w-0 flex-col sm:-m-6 lg:flex-row'

export const SellerMessagesView = () => {
	useSetSellerPageMeta({
		title: 'Mensagens',
		crumbs: ['Dashboard', 'Mensagens'],
	})

	const [query, setQuery] = useState('')
	const deferredQuery = useDeferredValue(query)
	const [filter, setFilter] = useState<Filter>('all')

	const { data, isLoading, isError, refetch } = useQuery<{
		data: SellerConversation[]
	}>({
		queryKey: ['seller-conversations'],
		queryFn: async () => {
			const res = await fetch('/api/stores/conversations')
			if (!res.ok) throw new Error('Failed to load conversations')
			return res.json()
		},
	})

	const conversations = data?.data ?? []
	const unreadCount = conversations.filter((c) => c.unread).length

	const visible = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase()
		return conversations.filter((c) => {
			if (filter === 'unread' && !c.unread) return false
			if (!q) return true
			return (
				c.otherUserName.toLowerCase().includes(q) ||
				(c.lastMessage?.toLowerCase().includes(q) ?? false)
			)
		})
	}, [conversations, deferredQuery, filter])

	const toolbar = (
		<div className='flex min-w-0 flex-col gap-2 border-b border-border/60 p-3 sm:flex-row sm:items-center sm:p-4'>
			<div className='relative min-w-0 flex-1'>
				<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Pesquisar…'
					className='h-11 rounded-full pl-9 text-base sm:h-10 sm:text-sm'
					aria-label='Pesquisar conversas'
				/>
			</div>
			<div
				className='flex shrink-0 gap-1.5'
				role='group'
				aria-label='Filtrar conversas'
			>
				{(
					[
						{ value: 'all', label: 'Todas' },
						{ value: 'unread', label: 'Não lidas' },
					] as const
				).map((opt) => (
					<button
						key={opt.value}
						type='button'
						onClick={() => setFilter(opt.value)}
						aria-pressed={filter === opt.value}
						className={cn(
							'min-h-11 rounded-full px-3.5 text-xs font-medium transition-colors sm:min-h-9',
							filter === opt.value
								? 'bg-foreground text-background'
								: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						{opt.label}
						{opt.value === 'unread' && unreadCount > 0
							? ` (${unreadCount})`
							: ''}
					</button>
				))}
			</div>
		</div>
	)

	if (isLoading) {
		return (
			<div className={SHELL}>
				<div className='flex min-h-0 w-full flex-col border-border/60 bg-card lg:w-80 lg:border-r xl:w-96'>
					<div className='flex h-14 items-center border-b border-border/60 px-4'>
						<div className='w-full space-y-1.5'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-3 w-32' />
						</div>
					</div>
					<div className='space-y-2 border-b border-border/60 p-3'>
						<Skeleton className='h-10 w-full rounded-full' />
					</div>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 border-b border-border/50 px-4 py-3'
						>
							<Skeleton className='size-10 rounded-full' />
							<div className='flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-3 w-48' />
							</div>
						</div>
					))}
				</div>
				<div className='hidden min-w-0 flex-1 flex-col bg-muted/20 lg:flex'>
					<div className='flex h-14 items-center border-b border-border/60 bg-card/95 px-4'>
						<div className='space-y-1.5'>
							<Skeleton className='h-4 w-28' />
							<Skeleton className='h-3 w-36' />
						</div>
					</div>
					<div className='flex flex-1 items-center justify-center'>
						<Skeleton className='size-12 rounded-2xl' />
					</div>
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex min-h-[50vh] min-w-0 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center'>
				<h2 className='font-heading text-lg font-bold tracking-tight'>
					Não foi possível carregar as mensagens
				</h2>
				<p className='mt-1.5 text-sm text-muted-foreground'>
					Tente novamente dentro de momentos.
				</p>
				<Button
					className='mt-6 rounded-full'
					variant='outline'
					onClick={() => refetch()}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (conversations.length === 0) {
		return (
			<div className='flex min-h-[50vh] min-w-0 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-20 text-center'>
				<div className='flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border/60'>
					<Inbox className='size-7 text-muted-foreground' />
				</div>
				<h2 className='mt-5 font-heading text-xl font-bold tracking-tight'>
					Caixa de entrada vazia
				</h2>
				<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
					Quando um cliente lhe enviar uma mensagem, aparecerá aqui.
				</p>
			</div>
		)
	}

	const listBody =
		visible.length === 0 ? (
			<div className='flex flex-1 flex-col items-center justify-center px-6 py-12 text-center'>
				<p className='text-sm text-muted-foreground'>
					Nenhuma conversa corresponde à pesquisa.
				</p>
				{(query || filter !== 'all') && (
					<Button
						variant='ghost'
						size='sm'
						className='mt-3 rounded-full'
						onClick={() => {
							setQuery('')
							setFilter('all')
						}}
					>
						Limpar filtros
					</Button>
				)}
			</div>
		) : (
			<div className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
				<div className='divide-y divide-border/50'>
					{visible.map((conv) => (
						<SellerInboxRow key={conv.id} conversation={conv} />
					))}
				</div>
			</div>
		)

	return (
		<div className={SHELL}>
			<div className='flex min-h-0 w-full flex-1 flex-col bg-card lg:w-80 lg:flex-none lg:border-r lg:border-border/60 xl:w-96'>
				<SellerInboxRailHeader
					subtitle={`${conversations.length} conversa${conversations.length === 1 ? '' : 's'}${
						unreadCount > 0
							? ` · ${unreadCount} não lida${unreadCount === 1 ? '' : 's'}`
							: ''
					}`}
				/>
				{toolbar}
				{listBody}
			</div>

			<div className='hidden min-w-0 flex-1 flex-col bg-muted/15 lg:flex'>
				<SellerThreadPlaceholderHeader />
				<div className='flex flex-1 flex-col items-center justify-center px-8 text-center'>
					<div className='flex size-14 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border/60'>
						<MessageSquare className='size-6 text-muted-foreground' />
					</div>
					<p className='mt-4 font-heading text-base font-semibold tracking-tight'>
						Seleccione uma conversa
					</p>
					<p className='mt-1 max-w-xs text-sm text-muted-foreground'>
						Escolha um cliente à esquerda para ler e responder.
					</p>
				</div>
			</div>
		</div>
	)
}
