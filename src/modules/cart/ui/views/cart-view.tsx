'use client'
import { ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart, useCartList, useHasHydrated } from '@/hooks/use-cart'
import { useCartReconcile } from '@/hooks/use-cart-reconcile'
import { cartsItemCount } from '@/modules/cart/lib/cart-utils'
import type { CreatedBuyerOrder } from '@/types'
import { OrderCreatedDialog } from '@/modules/orders/ui/components/order-created-dialog'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import { CartAside } from '../components/cart-aside'
import { CartClearDialog } from '../components/cart-clear-dialog'
import { CartEmpty } from '../components/cart-empty'
import { CartStoreFilter } from '../components/cart-store-filter'
import { CartStoreSection } from '../components/cart-store-section'
import { CartHeader } from '../sections/cart-header'

type ClearTarget =
	| {
			type: 'store'
			storeId: string
			storeName: string
	  }
	| {
			type: 'all'
	  }
	| null
export function CartView() {
	const hasHydrated = useHasHydrated()
	const carts = useCartList()
	const { byProductId } = useCartReconcile()
	const { applyCurrentPrice, removeItem, clearCart, clearAll } = useCart()
	const [storeFilter, setStoreFilter] = useState('all')
	const [clearTarget, setClearTarget] = useState<ClearTarget>(null)
	const [createdOrder, setCreatedOrder] = useState<{
		order: CreatedBuyerOrder
		storeId: string
	} | null>(null)
	const visibleCarts = useMemo(() => {
		if (storeFilter === 'all') return carts
		return carts.filter((cart) => cart.storeId === storeFilter)
	}, [carts, storeFilter])
	const itemCount = cartsItemCount(carts)
	const priceChangeCount = carts.reduce(
		(n, cart) =>
			n +
			cart.items.filter(
				(item) => byProductId[item.productId]?.priceChanged
			).length,
		0
	)
	const unavailableCount = carts.reduce(
		(n, cart) =>
			n +
			cart.items.filter(
				(item) => byProductId[item.productId]?.unavailable
			).length,
		0
	)
	const applyAllPrices = () => {
		for (const cart of carts) {
			for (const item of cart.items) {
				const live = byProductId[item.productId]
				if (live?.priceChanged && live.currentPrice != null) {
					applyCurrentPrice(
						cart.storeId,
						item.productId,
						live.currentPrice
					)
				}
			}
		}
		toast.success('Preços actualizados para os valores actuais.')
	}
	const removeUnavailable = () => {
		for (const cart of carts) {
			for (const item of cart.items) {
				if (byProductId[item.productId]?.unavailable) {
					removeItem(cart.storeId, item.productId)
				}
			}
		}
		toast.success('Produtos indisponíveis removidos.')
	}
	const confirmClear = () => {
		if (!clearTarget) return
		if (clearTarget.type === 'all') {
			clearAll()
			toast.success('Todos os carrinhos foram esvaziados.')
			setStoreFilter('all')
			return
		}
		clearCart(clearTarget.storeId)
		toast.success(`Carrinho da ${clearTarget.storeName} esvaziado.`)
		if (storeFilter === clearTarget.storeId) setStoreFilter('all')
	}
	const clearDialog =
		clearTarget?.type === 'all'
			? {
					title: 'Esvaziar todos os carrinhos?',
					description:
						'Os itens desaparecem deste dispositivo. Podes voltar a adicioná-los a partir das lojas.',
					confirmLabel: 'Esvaziar tudo',
				}
			: clearTarget
				? {
						title: `Esvaziar o carrinho da ${clearTarget.storeName}?`,
						description:
							'Os itens desta loja desaparecem deste dispositivo.',
						confirmLabel: 'Esvaziar este carrinho',
					}
				: null
	return (
		<div className='mx-auto w-full max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:py-8'>
			<CartHeader
				storeCount={carts.length}
				itemCount={itemCount}
				ready={hasHydrated}
			/>

			{!hasHydrated ? (
				<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
					<div className='min-w-0 flex-1 space-y-4'>
						<div className='h-48 animate-pulse rounded-2xl bg-muted/60' />
						<div className='h-48 animate-pulse rounded-2xl bg-muted/60' />
					</div>
					<div className='h-64 w-full animate-pulse rounded-2xl bg-muted/60 lg:w-96' />
				</div>
			) : carts.length === 0 ? (
				<CartEmpty />
			) : (
				<>
					<div className='mb-5 sm:mb-6'>
						<CartStoreFilter
							carts={carts}
							value={
								carts.some((c) => c.storeId === storeFilter)
									? storeFilter
									: 'all'
							}
							onChange={setStoreFilter}
						/>
					</div>

					<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
						<div className='order-2 min-w-0 flex-1 space-y-8 lg:order-1'>
							{visibleCarts.length === 0 ? (
								<EmptyState
									icon={ShoppingCart}
									title='Esta loja já não tem itens no carrinho'
									description='Escolhe outra loja ou vê todas.'
									action={
										<Button
											variant='outline'
											className='min-h-11 rounded-xl'
											onClick={() =>
												setStoreFilter('all')
											}
										>
											Ver todas as lojas
										</Button>
									}
								/>
							) : (
								visibleCarts.map((cart) => (
									<CartStoreSection
										key={cart.storeId}
										cart={cart}
										byProductId={byProductId}
										onRequestClear={() =>
											setClearTarget({
												type: 'store',
												storeId: cart.storeId,
												storeName: cart.storeName,
											})
										}
										onOrderCreated={(order) =>
											setCreatedOrder({
												order,
												storeId: cart.storeId,
											})
										}
									/>
								))
							)}
						</div>

						<CartAside
							className='order-1 lg:order-2'
							carts={carts}
							priceChangeCount={priceChangeCount}
							unavailableCount={unavailableCount}
							onApplyAllPrices={applyAllPrices}
							onRemoveUnavailable={removeUnavailable}
							onClearAll={() => setClearTarget({ type: 'all' })}
						/>
					</div>
				</>
			)}

			<OrderCreatedDialog
				order={createdOrder?.order ?? null}
				storeId={createdOrder?.storeId ?? null}
				onOpenChange={(open) => {
					if (!open) setCreatedOrder(null)
				}}
			/>

			{clearDialog ? (
				<CartClearDialog
					open={clearTarget != null}
					onOpenChange={(open) => {
						if (!open) setClearTarget(null)
					}}
					title={clearDialog.title}
					description={clearDialog.description}
					confirmLabel={clearDialog.confirmLabel}
					onConfirm={confirmClear}
				/>
			) : null}
		</div>
	)
}
