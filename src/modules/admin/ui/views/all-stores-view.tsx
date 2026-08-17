'use client'
import { useAllStores } from '@/modules/admin/hooks/use-all-stores'
import { ConfirmDialog } from '@/modules/admin/ui/components/confirm-dialog'
import { AllStoresBulkBar } from '@/modules/admin/ui/sections/all-stores-bulk-bar'
import { AllStoresFilters } from '@/modules/admin/ui/sections/all-stores-filters'
import { AllStoresListSection } from '@/modules/admin/ui/sections/all-stores-list-section'
export function AllStoresView() {
	const s = useAllStores()
	return (
		<div className='space-y-4'>
			<AllStoresFilters
				search={s.search}
				onSearchChange={s.setSearch}
				status={s.status}
				onStatusChange={s.setStatus}
			/>

			<AllStoresBulkBar
				selectedCount={s.selected.size}
				onSuspend={() => {
					s.selected.forEach((id) => {
						s.patchMutation.mutate({
							id,
							body: { status: 'SUSPENDED' },
						})
					})
				}}
				onDelete={() => {
					s.selected.forEach((id) => {
						s.deleteMutation.mutate(id)
					})
				}}
			/>

			<AllStoresListSection
				stores={s.stores}
				selected={s.selected}
				isLoading={s.isLoading}
				onToggleSelect={s.toggleSelect}
				onToggleSelectAll={s.toggleSelectAll}
				onSuspend={(id) =>
					s.patchMutation.mutate({
						id,
						body: { status: 'SUSPENDED' },
					})
				}
				onReactivate={(id) =>
					s.patchMutation.mutate({
						id,
						body: { status: 'ACTIVE' },
					})
				}
				onDelete={s.setConfirmDelete}
			/>

			<ConfirmDialog
				open={Boolean(s.confirmDelete)}
				onOpenChange={(v) => !v && s.setConfirmDelete(null)}
				title='Eliminar loja'
				description='Esta ação é irreversível. A loja e todos os seus dados serão eliminados permanentemente.'
				confirmLabel='Eliminar loja'
				loading={s.deleteMutation.isPending}
				onConfirm={() =>
					s.confirmDelete && s.deleteMutation.mutate(s.confirmDelete)
				}
			/>
		</div>
	)
}
