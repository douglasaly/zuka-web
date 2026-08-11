import { MessageSquare } from 'lucide-react'
import { SellerThreadPlaceholderHeader } from '../components/messages/seller-messages-headers'

export function SellerMessagesDetailPane() {
	return (
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
	)
}
