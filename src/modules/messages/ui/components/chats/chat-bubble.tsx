import type { ChatMessage } from '@/modules/messages/constants'
import { formatTime } from '@/utils/format-time'

type ChatBubbleProps = {
	message: ChatMessage
}

function StatusLabel({ status }: { status: ChatMessage['status'] }) {
	if (status === 'read') return 'lida'
	if (status === 'delivered') return 'entregue'
	return 'enviada'
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
	const isUser = message.userId !== null

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[70%] rounded-xl p-3 ${
					isUser
						? 'rounded-br-none bg-black text-white'
						: 'rounded-bl-none bg-gray-200 text-black'
				}`}
			>
				<p className='text-sm'>{message.content}</p>
				<div
					className={`mt-1 flex items-center gap-1 ${
						isUser ? 'justify-end' : 'justify-start'
					}`}
				>
					<span
						className={`text-[10px] ${
							isUser ? 'text-gray-300' : 'text-gray-500'
						}`}
					>
						{formatTime(message.createdAt)}
					</span>
					{isUser && (
						<span className='text-[10px] text-gray-400'>
							{StatusLabel({ status: message.status })}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
