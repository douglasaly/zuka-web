'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface SellerConversationViewProps {
	id: string
}

type Message = {
	id: string
	conversation_id: string
	user_id: string | null
	store_id: string | null
	content: string
	status: string
	created_at: string
}

export const SellerConversationView = ({ id }: SellerConversationViewProps) => {
	const [input, setInput] = useState('')
	const bottomRef = useRef<HTMLDivElement>(null)
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery<{ data: Message[] }>({
		queryKey: ['conversation-messages', id],
		queryFn: async () => {
			const res = await fetch(`/api/conversations/${id}/messages`)
			if (!res.ok) throw new Error('Failed to load messages')
			return res.json()
		},
	})

	const sendMutation = useMutation({
		mutationFn: async (content: string) => {
			const res = await fetch(`/api/conversations/${id}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content }),
			})
			if (!res.ok) throw new Error('Failed to send message')
			return res.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['conversation-messages', id],
			})
			setInput('')
		},
	})

	const handleSend = () => {
		if (!input.trim() || sendMutation.isPending) return
		sendMutation.mutate(input.trim())
	}

	const messages = data?.data ?? []

	if (isLoading) {
		return (
			<div className='flex h-[calc(100vh-12rem)] flex-col'>
				<div className='flex-1 space-y-4 overflow-y-auto p-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
						>
							<Skeleton
								className={`h-12 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`}
							/>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='flex h-[calc(100vh-12rem)] flex-col'>
			<div className='flex items-center gap-3 border-b border-border/60 px-4 py-3'>
				<Button
					variant='ghost'
					size='icon'
					className='shrink-0'
					render={
						<Link href='/dashboard/seller/mensagens'>
							<ArrowLeft className='size-4' />
						</Link>
					}
				/>
				<MessageSquare className='size-4 text-muted-foreground' />
				<p className='font-medium'>Conversa</p>
			</div>

			{messages.length === 0 ? (
				<div className='flex flex-1 flex-col items-center justify-center text-center'>
					<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
						<MessageSquare className='size-6 text-muted-foreground' />
					</div>
					<p className='mt-3 text-sm text-muted-foreground'>
						Sem mensagens ainda. Envie a primeira.
					</p>
				</div>
			) : (
				<div className='flex-1 space-y-3 overflow-y-auto p-4'>
					{messages.map((msg) => {
						const isStore = msg.store_id !== null
						return (
							<div
								key={msg.id}
								className={`flex ${isStore ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
										isStore
											? 'bg-primary text-primary-foreground'
											: 'bg-muted'
									}`}
								>
									<p>{msg.content}</p>
									<p
										className={`mt-1 text-right text-[10px] ${
											isStore
												? 'text-primary-foreground/60'
												: 'text-muted-foreground'
										}`}
									>
										{new Date(
											msg.created_at
										).toLocaleTimeString('pt-PT', {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							</div>
						)
					})}
					<div ref={bottomRef} />
				</div>
			)}

			<div className='flex items-center gap-2 border-t border-border/60 p-4'>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							handleSend()
						}
					}}
					placeholder='Escreva uma mensagem…'
					className='flex-1 rounded-full border border-border/60 bg-background px-4 py-2 text-sm outline-none focus:border-primary'
				/>
				<Button
					size='icon'
					className='shrink-0 rounded-full'
					onClick={handleSend}
					disabled={!input.trim() || sendMutation.isPending}
				>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	)
}
