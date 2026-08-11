'use client'

import { Store } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { StoreRow } from '@/modules/admin/hooks/use-all-stores'
import { EmptyState } from '@/modules/admin/ui/components/empty-state'
import { AllStoreRow } from '@/modules/admin/ui/components/stores/all-store-row'

type AllStoresListSectionProps = {
	stores: StoreRow[]
	selected: Set<string>
	isLoading: boolean
	onToggleSelect: (id: string) => void
	onToggleSelectAll: () => void
	onSuspend: (id: string) => void
	onReactivate: (id: string) => void
	onDelete: (id: string) => void
}

export function AllStoresListSection({
	stores,
	selected,
	isLoading,
	onToggleSelect,
	onToggleSelectAll,
	onSuspend,
	onReactivate,
	onDelete,
}: AllStoresListSectionProps) {
	if (isLoading) {
		return <Skeleton className='h-64 rounded-2xl' />
	}

	if (stores.length === 0) {
		return <EmptyState icon={Store} message='Nenhuma loja encontrada.' />
	}

	return (
		<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-8'>
							<input
								type='checkbox'
								className='size-4'
								checked={
									selected.size === stores.length &&
									stores.length > 0
								}
								onChange={onToggleSelectAll}
							/>
						</TableHead>
						<TableHead>Loja</TableHead>
						<TableHead>Proprietário</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Produtos</TableHead>
						<TableHead>Seguidores</TableHead>
						<TableHead>Criada</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{stores.map((store) => (
						<AllStoreRow
							key={store.id as string}
							store={store}
							isSelected={selected.has(store.id as string)}
							onToggleSelect={onToggleSelect}
							onSuspend={onSuspend}
							onReactivate={onReactivate}
							onDelete={onDelete}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
