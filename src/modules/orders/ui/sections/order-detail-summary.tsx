'use client'
import type {
	BuyerOrder,
	BuyerOrderItem,
	BuyerOrderReview,
} from '@/modules/orders/types'
import {
	OrderReviewForm,
	OrderReviewWaitingPanel,
} from '../components/order-review-form'
import { OrderReviewSummary } from '../components/order-review-summary'

type OrderDetailSummaryProps = {
	order: BuyerOrder
	items: BuyerOrderItem[]
	review: BuyerOrderReview | null
	canReview: boolean
	alreadyReviewed: boolean
	onReviewSubmitted: () => void
}
export function OrderDetailSummary({
	order,
	items,
	review,
	canReview,
	alreadyReviewed,
	onReviewSubmitted,
}: OrderDetailSummaryProps) {
	return (
		<aside className='order-1 w-full shrink-0 space-y-3 lg:sticky lg:top-24 lg:order-2 lg:w-[min(100%,24rem)] xl:w-104'>
			{canReview ? (
				<OrderReviewForm
					orderId={order.id}
					storeName={order.storeName}
					items={items}
					onSubmitted={onReviewSubmitted}
				/>
			) : alreadyReviewed && review ? (
				<OrderReviewSummary
					storeName={order.storeName}
					storeAvatar={order.storeAvatar}
					review={review}
				/>
			) : alreadyReviewed ? (
				<div className='rounded-2xl border border-emerald-500/20 bg-emerald-500/6 p-5'>
					<p className='font-heading text-base font-semibold tracking-tight'>
						Já avaliaste este pedido
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						A tua opinião sobre {order.storeName} já está registada.
					</p>
				</div>
			) : order.status !== 'cancelled' ? (
				<OrderReviewWaitingPanel statusLabel={order.statusLabel} />
			) : null}
		</aside>
	)
}
