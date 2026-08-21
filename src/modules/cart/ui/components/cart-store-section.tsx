'use client'
import { useMutation } from '@tanstack/react-query'
import { MessageCircle, Package, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StoreAvatar } from '@/components/store-avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/cart/use-cart'
import { useUserProfile } from '@/hooks/use-user-profile'
import { startConversation } from '@/lib/api/marketplace'
import { STORE_PLACEHOLDER } from '@/lib/constants/images'
import { trackContactEvent } from '@/lib/contact-events'
import {
	buildCartWhatsAppMessage,
	cartCurrency,
	cartItemCount,
	cartTotal,
} from '@/modules/cart/lib/cart-utils'
import { useCreateOrder } from '@/modules/orders/hooks/use-create-order'
import { whatsappHref } from '@/modules/orders/lib/order-copy'
import type { Cart, CreatedBuyerOrder, ReconciledProduct } from '@/types'
import { formatPrice } from '@/utils/format-price'
import { CartItemRow } from './cart-item-row'

type CartStoreSectionProps = {
	cart: Cart
	byProductId: Record<string, ReconciledProduct>
	onRequestClear: () => void
	onOrderCreated: (order: CreatedBuyerOrder) => void
}
export function CartStoreSection({
	cart,
	byProductId,
	onRequestClear,
	onOrderCreated,
}: CartStoreSectionProps) {
	const router = useRouter()
	const { isAuthenticated } = useUserProfile()
	const { updateQuantity, removeItem, applyCurrentPrice } = useCart()
	const createOrder = useCreateOrder({
		onCreated: (order) => onOrderCreated(order),
	})
	const total = cartTotal(cart)
	const currency = cartCurrency(cart)
	const count = cartItemCount(cart)
	const storePhone = cart.items
		.map((item) => byProductId[item.productId]?.storePhone)
		.find((phone) => Boolean(phone))
	const firstAvailable = cart.items.find(
		(item) => !byProductId[item.productId]?.unavailable
	)
	const hasUnavailable = cart.items.some(
		(item) => byProductId[item.productId]?.unavailable
	)
	const canOrder = Boolean(firstAvailable) && !hasUnavailable
	const ordering = createOrder.isPending
	const chatMutation = useMutation({
		mutationFn: () => startConversation(firstAvailable?.productId ?? ''),
		onSuccess: (result) => {
			router.push(`/mensagens/${result.conversationId}`)
		},
		onError: () => {
			toast.error(
				isAuthenticated
					? 'Não foi possível abrir o chat. Tenta de novo.'
					: 'Inicia sessão para abrir o chat com a loja.'
			)
		},
	})
	const openWhatsApp = () => {
		if (!storePhone) return
		trackContactEvent({
			storeId: cart.storeId,
			productId: firstAvailable?.productId,
			type: 'whatsapp',
			source: 'store',
		})
		window.open(
			whatsappHref(storePhone, buildCartWhatsAppMessage(cart)),
			'_blank',
			'noopener,noreferrer'
		)
	}
	const handleCreateOrder = async () => {
		if (!isAuthenticated) {
			toast.info('Inicia sessão para fazer o pedido.')
			router.push('/auth/login?next=/carrinho')
			return
		}
		try {
			await createOrder.mutateAsync({
				storeId: cart.storeId,
				items: cart.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
				})),
			})
		} catch {}
	}
	return (
		<section className='space-y-3' aria-labelledby={`cart-${cart.storeId}`}>
			<div className='flex items-center justify-between gap-3'>
				<Link
					href={`/lojas/${cart.storeSlug}`}
					className='flex min-w-0 items-center gap-2 hover:underline'
				>
					<StoreAvatar
						name={cart.storeName}
						imageUrl={cart.storeAvatar ?? STORE_PLACEHOLDER}
						size='sm'
					/>
					<div className='min-w-0'>
						<h2
							id={`cart-${cart.storeId}`}
							className='truncate font-heading text-sm font-semibold tracking-tight'
						>
							{cart.storeName}
						</h2>
						<p className='text-xs text-muted-foreground'>
							{count === 1 ? '1 item' : `${count} itens`}
						</p>
					</div>
				</Link>
				<Button
					variant='ghost'
					size='sm'
					className='min-h-9 shrink-0 rounded-full px-3'
					render={<Link href={`/lojas/${cart.storeSlug}`} />}
				>
					<Store className='size-3.5' aria-hidden />
					Ver loja
				</Button>
			</div>

			<ul className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
				{cart.items.map((item, index) => (
					<li key={item.productId}>
						{index > 0 ? (
							<Separator className='opacity-60' />
						) : null}
						<CartItemRow
							item={item}
							reconcile={byProductId[item.productId]}
							onQuantityChange={(quantity) =>
								updateQuantity(
									cart.storeId,
									item.productId,
									quantity
								)
							}
							onRemove={() =>
								removeItem(cart.storeId, item.productId)
							}
							onApplyCurrentPrice={(unitPrice) =>
								applyCurrentPrice(
									cart.storeId,
									item.productId,
									unitPrice
								)
							}
						/>
					</li>
				))}
				<li className='flex items-center justify-between gap-3 border-t border-border/70 bg-muted/35 px-4 py-3.5'>
					<span className='text-sm text-muted-foreground'>
						Subtotal desta loja
					</span>
					<span className='font-heading text-lg font-bold tabular-nums tracking-tight'>
						{formatPrice(total, currency)}
					</span>
				</li>
			</ul>

			<div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
				<Button
					type='button'
					size='lg'
					className='min-h-11 flex-1 rounded-xl text-white 	 sm:min-w-48'
					onClick={handleCreateOrder}
					disabled={!canOrder || ordering}
				>
					<Package className='size-4' aria-hidden />
					{ordering ? 'A criar o pedido…' : 'Fazer pedido'}
				</Button>
				{storePhone ? (
					<Button
						type='button'
						variant='outline'
						size='lg'
						className='min-h-11 flex-1 rounded-xl'
						onClick={openWhatsApp}
						disabled={!firstAvailable || ordering}
					>
						<MessageCircle className='size-4' aria-hidden />
						Falar no WhatsApp
					</Button>
				) : (
					<Button
						type='button'
						variant='outline'
						size='lg'
						className='min-h-11 flex-1 rounded-xl'
						onClick={() => chatMutation.mutate()}
						disabled={
							chatMutation.isPending ||
							!firstAvailable ||
							ordering
						}
					>
						<MessageCircle className='size-4' aria-hidden />
						{chatMutation.isPending
							? 'A abrir o chat…'
							: 'Falar no chat'}
					</Button>
				)}
				{storePhone ? (
					<Button
						type='button'
						variant='outline'
						size='lg'
						className='min-h-11 rounded-xl sm:flex-none'
						onClick={() => chatMutation.mutate()}
						disabled={
							chatMutation.isPending ||
							!firstAvailable ||
							ordering
						}
					>
						{chatMutation.isPending
							? 'A abrir o chat…'
							: 'Abrir chat'}
					</Button>
				) : null}
				<Button
					type='button'
					variant='ghost'
					size='lg'
					className='min-h-11 rounded-xl text-muted-foreground sm:flex-none'
					onClick={onRequestClear}
					disabled={ordering}
				>
					Esvaziar
				</Button>
			</div>
		</section>
	)
}
