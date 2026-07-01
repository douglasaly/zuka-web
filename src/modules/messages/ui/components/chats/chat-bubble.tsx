import type { ChatMessage } from '@/modules/messages/constants'

type ChatBubbleProps = {
	message: ChatMessage
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
	const isUser = message.sender === 'user'

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[70%] rounded-xl p-3 ${
					isUser
						? 'rounded-br-none bg-black text-white'
						: 'rounded-bl-none bg-gray-200 text-black'
				}`}
			>
				<p className='text-sm'>{message.text}</p>
				<span
					className={`mt-1 block text-right text-[10px] ${
						isUser ? 'text-gray-300' : 'text-gray-500'
					}`}
				>
					{message.time}
				</span>
			</div>
		</div>
	)
}
