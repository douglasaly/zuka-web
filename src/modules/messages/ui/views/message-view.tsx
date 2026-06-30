/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client'

import { ArrowLeft, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { StoreAvatar } from '@/components/store-avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface MessageViewProps {
	messageId: string
}

export const messages = [
	{
		id: 2,
		sender: 'user',
		text: 'Olá! Ainda está disponível o Samsung Galaxy A15?',
		time: '14:02',
	},
	{
		id: 3,
		sender: 'seller',
		text: 'Sim, está novo na caixa.',
		time: '14:03',
	},
	{ id: 4, sender: 'user', text: 'Qual é o preço final?', time: '14:04' },
	{ id: 5, sender: 'seller', text: 'Está a 12.500 MT.', time: '14:04' },
	{
		id: 6,
		sender: 'user',
		text: 'Consegue fazer por 11.000 MT?',
		time: '14:05',
	},
	{ id: 7, sender: 'seller', text: 'Posso fazer 11.800 MT.', time: '14:06' },
	{
		id: 8,
		sender: 'user',
		text: 'Inclui carregador e caixa?',
		time: '14:06',
	},
	{
		id: 9,
		sender: 'seller',
		text: 'Sim, tudo original incluído.',
		time: '14:07',
	},
	{
		id: 10,
		sender: 'user',
		text: 'Perfeito 👍 posso ver hoje?',
		time: '14:07',
	},
	{
		id: 11,
		sender: 'seller',
		text: 'Sim, estou disponível à tarde.',
		time: '14:08',
	},
	{
		id: 12,
		sender: 'user',
		text: 'Onde podemos nos encontrar?',
		time: '14:08',
	},
	{
		id: 13,
		sender: 'seller',
		text: 'No centro de Maputo ou Matola.',
		time: '14:09',
	},
	{
		id: 14,
		sender: 'user',
		text: 'Ok, vou confirmar depois 👍',
		time: '14:09',
	},
	{ id: 15, sender: 'seller', text: 'Fico à espera 👍', time: '14:10' },
]

export const MessageView = ({ messageId }: MessageViewProps) => {
	const router = useRouter()
	const bottomRef = useRef<HTMLDivElement | null>(null)

	const scrollToBottom = useCallback(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [scrollToBottom])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	return (
		<div className='w-full min-w-0'>
			{/* HEADER */}
			<div className='fixed top-0 left-0 md:left-72 right-0 md:right-8 z-50 bg-white border flex items-center gap-2 p-4 pt-6'>
				<Button
					className='hover:bg-secondary/40'
					variant='ghost'
					onClick={() => router.back()}
				>
					<ArrowLeft className='size-5' />
				</Button>

				<Separator
					orientation='vertical'
					className='h-10 self-center'
				/>

				<div className='flex-1 flex items-center gap-2'>
					<StoreAvatar
						imageUrl='/placeholder.jpg'
						name='Loja da Fátima'
						size='lg'
					/>

					<div className='flex flex-col justify-center space-y-1'>
						<h3 className='text-md font-semibold leading-tight'>
							Loja da Fátima
						</h3>
						<div className='text-muted-foreground text-xs leading-tight line-clamp-1'>
							Maputo • Sommerchild
						</div>
					</div>
				</div>
			</div>

			{/* CHAT */}
			<div className='flex flex-col h-screen'>
				<div className='flex-1 overflow-y-auto pt-24 px-4 pl-8 pb-32 flex flex-col gap-3'>
					{messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								msg.sender === 'user'
									? 'justify-end'
									: 'justify-start'
							}`}
						>
							<div
								className={`p-3 max-w-[70%] rounded-xl ${
									msg.sender === 'user'
										? 'bg-black text-white rounded-br-none'
										: 'bg-gray-200 text-black rounded-bl-none'
								}`}
							>
								<p className='text-sm'>{msg.text}</p>
								<span
									className={`text-[10px] block text-right mt-1 ${
										msg.sender === 'user'
											? 'text-gray-300'
											: 'text-gray-500'
									}`}
								>
									{msg.time}
								</span>
							</div>
						</div>
					))}

					<div ref={bottomRef} />
				</div>

				<div className='fixed bottom-0 left-0 md:left-72 right-0 md:right-8 bg-white border pb-6 pt-4 z-50'>
					<div className='flex gap-2 px-4'>
						<Input
							className='placeholder:text-muted-foreground placeholder:text-sm h-12 bg-gray-200 flex-1'
							placeholder='Escreva uma mensagem...'
						/>
						<Button className='h-12 w-12'>
							<Send className='size-5' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
