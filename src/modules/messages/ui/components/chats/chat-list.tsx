/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Supress> */
'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/modules/messages/constants'
import { formatLongPtDate } from '@/utils/format-date'
import { ChatBubble } from './chat-bubble'

dayjs.locale('pt')

type DateGroup = {
	dateKey: string
	label: string
	messages: ChatMessage[]
}

function getDateLabel(date: dayjs.Dayjs): string {
	const today = dayjs().startOf('day')

	if (date.isSame(today, 'day')) return 'Hoje'
	if (date.isSame(today.subtract(1, 'day'), 'day')) return 'Ontem'

	return formatLongPtDate(date.toDate())
}

function groupMessagesByDate(messages: ChatMessage[]): DateGroup[] {
	const groups: DateGroup[] = []

	for (const msg of messages) {
		const d = dayjs(msg.createdAt)
		const dateKey = d.format('YYYY-MM-DD')
		const last = groups.at(-1)

		if (last?.dateKey === dateKey) {
			last.messages.push(msg)
		} else {
			groups.push({ dateKey, label: getDateLabel(d), messages: [msg] })
		}
	}

	return groups
}

type ChatMessagesListProps = {
	messages: ChatMessage[]
}

export const ChatMessagesList = ({ messages }: ChatMessagesListProps) => {
	const bottomRef = useRef<HTMLDivElement | null>(null)

	const lastMessageId = messages.at(-1)?.id

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [lastMessageId])

	const groups = groupMessagesByDate(messages)

	return (
		<div className='flex flex-1 flex-col gap-3 overflow-y-auto px-4 pl-8 pb-32 pt-24'>
			{groups.map((group) => (
				<div key={group.dateKey}>
					<div className='sticky top-0 z-10 flex justify-center py-2'>
						<span className='rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'>
							{group.label}
						</span>
					</div>

					<div className='flex flex-col gap-3'>
						{group.messages.map((message) => (
							<ChatBubble key={message.id} message={message} />
						))}
					</div>
				</div>
			))}

			<div ref={bottomRef} />
		</div>
	)
}
