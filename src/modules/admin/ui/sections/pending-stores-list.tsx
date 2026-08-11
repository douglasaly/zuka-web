'use client'

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { StoreRow } from '@/modules/admin/hooks/use-pending-stores'
import { PendingStoreRow } from '../components/stores/pending-store-row'

type PendingStoresListProps = {
	stores: StoreRow[]
	onReview: (id: string) => void
}

export function PendingStoresList({
	stores,
	onReview,
}: PendingStoresListProps) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Loja</TableHead>
						<TableHead>Proprietário</TableHead>
						<TableHead>Categoria</TableHead>
						<TableHead>Cidade</TableHead>
						<TableHead>Submetido</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{stores.map((store) => (
						<PendingStoreRow
							key={store.id as string}
							store={store}
							onReview={onReview}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
