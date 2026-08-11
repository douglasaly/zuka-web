'use client'

import { useSellerOrderDetail } from '@/modules/seller/hooks/use-seller-order-detail'
import { OrderStatusConfirmDialog } from '@/modules/seller/ui/components/orders/order-status-confirm-dialog'
import { SellerOrderDetailActions } from '@/modules/seller/ui/sections/seller-order-detail-actions'
import { SellerOrderDetailBuyer } from '@/modules/seller/ui/sections/seller-order-detail-buyer'
import { SellerOrderDetailGates } from '@/modules/seller/ui/sections/seller-order-detail-gates'
import { SellerOrderDetailHeader } from '@/modules/seller/ui/sections/seller-order-detail-header'
import { SellerOrderDetailItems } from '@/modules/seller/ui/sections/seller-order-detail-items'
import { SellerOrderDetailTimeline } from '@/modules/seller/ui/sections/seller-order-detail-timeline'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

interface SellerOrderDetailViewProps {
	id: string
}

export const SellerOrderDetailView = ({ id }: SellerOrderDetailViewProps) => {
	useSetSellerPageMeta({
		title: 'Detalhe do pedido',
		crumbs: ['Dashboard', 'Pedidos', `#${id.slice(0, 8)}`],
	})

	const {
		data,
		isLoading,
		isError,
		refetch,
		pending,
		setPending,
		mutation,
		canUpdateOrder,
		shortId,
		requestStatus,
	} = useSellerOrderDetail(id)

	if (isLoading || isError || !data) {
		return (
			<SellerOrderDetailGates
				isLoading={isLoading}
				isError={isError}
				isEmpty={!isLoading && !isError && !data}
				onRetry={() => refetch()}
			/>
		)
	}

	return (
		<div className='w-full min-w-0 space-y-6 pb-10'>
			<SellerOrderDetailHeader
				shortId={shortId}
				status={data.status}
				statusLabel={data.statusLabel}
				reviewState={data.reviewState}
			/>

			<SellerOrderDetailBuyer buyer={data.buyer} />

			<SellerOrderDetailItems
				items={data.items}
				total={data.total}
				currency={data.currency}
			/>

			<SellerOrderDetailTimeline timeline={data.timeline} />

			<SellerOrderDetailActions
				status={data.status}
				shortId={shortId}
				canUpdateOrder={canUpdateOrder}
				onRequestStatus={requestStatus}
			/>

			<OrderStatusConfirmDialog
				action={pending}
				isPending={mutation.isPending}
				onOpenChange={(open) => {
					if (!open) setPending(null)
				}}
				onConfirm={(action) => mutation.mutate(action)}
			/>
		</div>
	)
}
