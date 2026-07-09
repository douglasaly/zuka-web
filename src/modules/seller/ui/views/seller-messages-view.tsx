'use client'

import { useQuery } from '@tanstack/react-query'
import { Inbox, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

type Conversation = {
	id: string
	otherUserName: string
	otherUserAvatar: string | null
	lastMessage: string | null
	lastMessageAt: string | null
	unread: boolean
}

export const SellerMessagesView = () => {
	const { data, isLoading } = useQuery<{ conversations: Conversation[] }>({
		queryKey: ['seller-conversations'],
		queryFn: async () => {
			const res = await fetch('/api/conversations')
			if (!res.ok) throw new Error('Failed to load conversations')
			return res.json()
		},
	})

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4'
					>
						<Skeleton className='size-10 rounded-full' />
						<div className='flex-1 space-y-1.5'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-3 w-48' />
						</div>
					</div>
				))}
			</div>
		)
	}

	const conversations = data?.conversations ?? []

	if (conversations.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<Inbox className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Caixa de entrada vazia
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					Quando um cliente lhe enviar uma mensagem, aparecerá aqui.
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-3'>
			{conversations.map((conv) => (
				<Link
					key={conv.id}
					href={`/dashboard/seller/mensagens/${conv.id}`}
					className='flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-accent'
				>
					<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-muted'>
						<MessageSquare className='size-4 text-muted-foreground' />
					</div>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2'>
							<p className='truncate text-sm font-medium'>
								{conv.otherUserName}
							</p>
							{conv.unread && (
								<span className='size-2 shrink-0 rounded-full bg-primary' />
							)}
						</div>
						<p className='truncate text-xs text-muted-foreground'>
							{conv.lastMessage ?? 'Sem mensagens'}
						</p>
					</div>
					{conv.lastMessageAt && (
						<p className='shrink-0 text-xs text-muted-foreground'>
							{new Date(conv.lastMessageAt).toLocaleDateString(
								'pt-PT'
							)}
						</p>
					)}
				</Link>
			))}
		</div>
	)
}
