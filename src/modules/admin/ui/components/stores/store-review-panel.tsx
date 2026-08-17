'use client'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useStoreReview } from '@/modules/admin/hooks/use-pending-stores'
import { StoreReviewActions } from './store-review-actions'
import { StoreReviewDetail } from './store-review-detail'

type StoreReviewPanelProps = {
	storeId: string
	onClose: () => void
}
export function StoreReviewPanel({ storeId, onClose }: StoreReviewPanelProps) {
	const {
		store,
		docs,
		owner,
		isLoading,
		rejectionReason,
		setRejectionReason,
		showReject,
		setShowReject,
		mutation,
	} = useStoreReview(storeId, onClose)
	return (
		<div className='flex h-full flex-col'>
			<SheetHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
				<SheetTitle className='font-heading text-base font-bold'>
					{isLoading ? (
						<Skeleton className='h-5 w-40' />
					) : (
						((store?.name as string) ?? '—')
					)}
				</SheetTitle>
			</SheetHeader>

			<div className='flex-1 overflow-y-auto px-6 py-5 space-y-6'>
				{isLoading ? (
					<div className='space-y-4'>
						{Array.from({ length: 5 }, (_, i) => (
							<Skeleton key={i} className='h-10 rounded-xl' />
						))}
					</div>
				) : (
					<StoreReviewDetail
						store={store ?? {}}
						owner={owner}
						docs={docs}
					/>
				)}
			</div>

			<StoreReviewActions
				showReject={showReject}
				rejectionReason={rejectionReason}
				isPending={mutation.isPending}
				onShowReject={() => setShowReject(true)}
				onCancelReject={() => setShowReject(false)}
				onRejectionReasonChange={setRejectionReason}
				onApprove={() => mutation.mutate({ status: 'ACTIVE' })}
				onReject={() =>
					mutation.mutate({
						status: 'REJECTED',
						reason: rejectionReason,
					})
				}
			/>
		</div>
	)
}
