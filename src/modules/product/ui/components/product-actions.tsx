'use client'
import { MessageCircle, Phone, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/cart/use-cart'
import { trackContactEvent } from '@/lib/contact-events'
import type { CartProductInput } from '@/types'

type ProductActionsProps = {
	storeId: string
	productId: string
	product: CartProductInput
	whatsappHref: string | null
	phoneHref: string | null
	onChat: () => void
	isChatting?: boolean
}
export const ProductActions = ({
	storeId,
	productId,
	product,
	whatsappHref,
	phoneHref,
	onChat,
	isChatting,
}: ProductActionsProps) => {
	const { addItem } = useCart()
	const handleAddToCart = () => {
		addItem(product)
	}
	const openWhatsApp = () => {
		if (!whatsappHref) return
		trackContactEvent({
			storeId,
			productId,
			type: 'whatsapp',
			source: 'product',
		})
		window.open(whatsappHref, '_blank', 'noopener,noreferrer')
	}
	const openCall = () => {
		if (!phoneHref) return
		trackContactEvent({
			storeId,
			productId,
			type: 'call',
			source: 'product',
		})
		window.location.href = phoneHref
	}
	return (
		<div className='space-y-2'>
			<Button
				type='button'
				onClick={handleAddToCart}
				className='w-full rounded-xl'
				size='lg'
			>
				<ShoppingCart className='size-4' />
				Adicionar ao carrinho
			</Button>
			<div className='flex gap-2'>
				{whatsappHref && (
					<Button
						type='button'
						onClick={openWhatsApp}
						className='flex-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a]'
						size='lg'
					>
						WhatsApp
					</Button>
				)}
				{phoneHref && (
					<Button
						type='button'
						onClick={openCall}
						variant='outline'
						size='lg'
						className='rounded-xl'
					>
						<Phone className='size-4' />
						Ligar
					</Button>
				)}
				<Button
					variant='outline'
					size='lg'
					className='rounded-xl'
					onClick={onChat}
					disabled={isChatting}
				>
					<MessageCircle className='size-4' />
					{isChatting ? 'A abrir...' : 'Chat'}
				</Button>
			</div>
		</div>
	)
}
