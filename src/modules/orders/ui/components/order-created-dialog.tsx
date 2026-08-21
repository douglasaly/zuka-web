'use client'
import { CheckCircle2, MessageCircle, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { trackContactEvent } from '@/lib/contact-events'
import { buyerOrderPath, whatsappHref } from '@/modules/orders/lib/order-copy'
import type { CreatedBuyerOrder } from '@/types'

type OrderCreatedDialogProps = {
	order: CreatedBuyerOrder | null
	storeId: string | null
	onOpenChange: (open: boolean) => void
}
export function OrderCreatedDialog({
	order,
	storeId,
	onOpenChange,
}: OrderCreatedDialogProps) {
	const router = useRouter()
	const open = order != null
	const goToChat = () => {
		if (!order) return
		onOpenChange(false)
		router.push(`/mensagens/${order.conversationId}`)
	}
	const goToWhatsApp = () => {
		if (!order?.storePhone) return
		if (storeId) {
			trackContactEvent({
				storeId,
				type: 'whatsapp',
				source: 'store',
			})
		}
		window.open(
			whatsappHref(order.storePhone, order.whatsappMessage),
			'_blank',
			'noopener,noreferrer'
		)
		onOpenChange(false)
	}
	const goToOrder = () => {
		if (!order) return
		onOpenChange(false)
		router.push(buyerOrderPath(order.orderId))
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='rounded-2xl sm:max-w-md' showCloseButton>
				<DialogHeader>
					<div className='flex size-11 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-700'>
						<CheckCircle2 className='size-5' aria-hidden />
					</div>
					<DialogTitle className='font-heading text-lg font-bold tracking-tight'>
						Pedido #{order?.shortId} criado
					</DialogTitle>
					<DialogDescription>
						A {order?.storeName} já foi notificada. Escolhe como
						queres enviar a mensagem do pedido.
					</DialogDescription>
				</DialogHeader>

				<div className='flex flex-col gap-2'>
					<Button
						type='button'
						size='lg'
						className='min-h-11 w-full justify-start rounded-xl'
						onClick={goToChat}
					>
						<MessageSquare className='size-4' aria-hidden />
						Enviar nas mensagens
					</Button>
					{order?.storePhone ? (
						<Button
							type='button'
							size='lg'
							className='min-h-11 w-full justify-start rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] hover:text-white'
							onClick={goToWhatsApp}
						>
							<MessageCircle className='size-4' aria-hidden />
							Enviar no WhatsApp
						</Button>
					) : null}
					<Button
						type='button'
						variant='ghost'
						size='lg'
						className='min-h-11 w-full rounded-xl text-muted-foreground'
						onClick={goToOrder}
					>
						Ver o pedido
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
