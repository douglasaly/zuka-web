'use client'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { StoreReviewPanel } from '../components/stores/store-review-panel'

type PendingStoresReviewSheetProps = {
	reviewId: string | null
	onClose: () => void
}

export function PendingStoresReviewSheet({
	reviewId,
	onClose,
}: PendingStoresReviewSheetProps) {
	return (
		<Sheet open={Boolean(reviewId)} onOpenChange={(v) => !v && onClose()}>
			<SheetContent
				side='right'
				showCloseButton={false}
				className='w-full p-0 sm:max-w-[480px]'
			>
				{reviewId && (
					<StoreReviewPanel storeId={reviewId} onClose={onClose} />
				)}
			</SheetContent>
		</Sheet>
	)
}
