import { MessageSquare } from 'lucide-react'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import type { Conversation } from '../../constants'
import { ConversationItem } from './converstion-item'

type ConversationsListProps = {
	conversations: Conversation[]
}

export const ConversationsList = ({
	conversations,
}: ConversationsListProps) => {
	if (conversations.length === 0) {
		return (
			<EmptyState
				icon={MessageSquare}
				title='Ainda não tem mensagens'
				description='As suas conversas com as lojas aparecerão aqui'
			/>
		)
	}

	return (
		<div className='flex flex-col space-y-4'>
			{conversations.map((conversation) => (
				<ConversationItem
					key={conversation.id}
					conversation={conversation}
				/>
			))}
		</div>
	)
}
