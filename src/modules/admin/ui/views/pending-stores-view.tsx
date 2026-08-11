'use client'

import { Suspense } from 'react'
import { usePendingStores } from '@/modules/admin/hooks/use-pending-stores'
import { TableSkeleton } from '../components/table-skeleton'
import { PendingStoresEmpty } from '../sections/pending-stores-empty'
import { PendingStoresList } from '../sections/pending-stores-list'
import { PendingStoresReviewSheet } from '../sections/pending-stores-review-sheet'
import { PendingStoresToolbar } from '../sections/pending-stores-toolbar'

function PendingStoresInner() {
	const { stores, isLoading, reviewId, openReview, closeReview } =
		usePendingStores()

	return (
		<div className='space-y-4'>
			<PendingStoresToolbar isLoading={isLoading} count={stores.length} />

			{isLoading ? (
				<TableSkeleton rows={5} cols={5} />
			) : stores.length === 0 ? (
				<PendingStoresEmpty />
			) : (
				<PendingStoresList stores={stores} onReview={openReview} />
			)}

			<PendingStoresReviewSheet
				reviewId={reviewId}
				onClose={closeReview}
			/>
		</div>
	)
}

export function PendingStoresView() {
	return (
		<Suspense>
			<PendingStoresInner />
		</Suspense>
	)
}
