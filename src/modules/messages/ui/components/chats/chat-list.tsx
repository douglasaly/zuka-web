/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Supress> */
'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/modules/messages/constants'
import { ChatBubble } from './chat-bubble'

type ChatMessagesListProps = {
	messages: ChatMessage[]
}

export const ChatMessagesList = ({ messages }: ChatMessagesListProps) => {
	const bottomRef = useRef<HTMLDivElement | null>(null)

	const lastMessageId = messages.at(-1)?.id

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [lastMessageId])

	return (
		<div className='flex flex-1 flex-col gap-3 overflow-y-auto px-4 pl-8 pb-32 pt-24'>
			{messages.map((message) => (
				<ChatBubble key={message.id} message={message} />
			))}

			<div ref={bottomRef} />
		</div>
	)
}
