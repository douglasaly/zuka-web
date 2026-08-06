import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import type { InboxItem } from '@/types/messages'
import { ConversationItem } from './converstion-item'

type ConversationsListProps = {
	conversations: InboxItem[]
}

export const ConversationsList = ({
	conversations,
}: ConversationsListProps) => {
	if (conversations.length === 0) {
		return (
			<EmptyState
				icon={MessageSquare}
				title='Ainda sem mensagens'
				description='Contacta uma loja a partir de um produto. A conversa aparece aqui.'
				className='border-dashed bg-muted/20 py-16'
				action={
					<Button
						className='min-h-11 rounded-full px-5'
						render={<Link href='/feed/explorar' />}
					>
						Explorar produtos
					</Button>
				}
			/>
		)
	}

	return (
		<div className='flex flex-col gap-3' role='list' aria-label='Conversas'>
			{conversations.map((conversation) => (
				<div key={conversation.conversationId} role='listitem'>
					<ConversationItem conversation={conversation} />
				</div>
			))}
		</div>
	)
}
