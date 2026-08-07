'use client'

import { cn } from '@/lib/utils'
import { useOrderDetail } from '../../hooks/use-order-detail'
import {
	OrderDetailDesktopActions,
	OrderDetailMobileActions,
} from '../sections/order-detail-actions'
import { OrderDetailGates } from '../sections/order-detail-gates'
import { OrderDetailHeader } from '../sections/order-detail-header'
import { OrderDetailItems } from '../sections/order-detail-items'
import { OrderDetailProgress } from '../sections/order-detail-progress'
import { OrderDetailStore } from '../sections/order-detail-store'
import { OrderDetailSummary } from '../sections/order-detail-summary'

interface OrderDetailViewProps {
	id: string
}

export const OrderDetailView = ({ id }: OrderDetailViewProps) => {
	const {
		data,
		isLoading,
		isError,
		refetch,
		isFetching,
		order,
		items,
		timeline,
		notes,
		review,
		firstProductId,
		guidance,
		tone,
		countLabel,
		canReview,
		alreadyReviewed,
		showBuyAgain,
		hasMobileActions,
		onReviewSubmitted,
	} = useOrderDetail(id)

	if (isLoading || isError || !data || !order || !guidance || !tone) {
		return (
			<OrderDetailGates
				isLoading={isLoading}
				isError={isError}
				isEmpty={!isLoading && !isError && !data}
				isFetching={isFetching}
				onRetry={() => refetch()}
			/>
		)
	}

	return (
		<div
			className={cn(
				'mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8',
				hasMobileActions
					? 'pb-[max(6.5rem,env(safe-area-inset-bottom))] md:pb-10'
					: 'pb-[max(1.5rem,env(safe-area-inset-bottom))]'
			)}
		>
			<OrderDetailHeader
				order={order}
				guidance={guidance}
				tone={tone}
				countLabel={countLabel}
			/>

			<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
				<div className='order-2 min-w-0 flex-1 space-y-6 lg:order-1'>
					<OrderDetailProgress timeline={timeline} notes={notes} />
					<OrderDetailItems order={order} items={items} />
					<OrderDetailStore order={order} />
					<OrderDetailDesktopActions
						order={order}
						showBuyAgain={showBuyAgain}
						firstProductId={firstProductId}
					/>
				</div>

				<OrderDetailSummary
					order={order}
					items={items}
					review={review}
					canReview={canReview}
					alreadyReviewed={alreadyReviewed}
					onReviewSubmitted={onReviewSubmitted}
				/>
			</div>

			<OrderDetailMobileActions
				order={order}
				showBuyAgain={showBuyAgain}
				firstProductId={firstProductId}
				hasMobileActions={hasMobileActions}
			/>
		</div>
	)
}
