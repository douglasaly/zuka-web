'use client'

import { useAdminProducts } from '@/modules/admin/hooks/use-admin-products'
import { ConfirmDialog } from '@/modules/admin/ui/components/confirm-dialog'
import { AdminProductPreviewSheet } from '@/modules/admin/ui/components/products/admin-product-preview-sheet'
import { AdminProductsBulkBar } from '@/modules/admin/ui/sections/admin-products-bulk-bar'
import { AdminProductsFilters } from '@/modules/admin/ui/sections/admin-products-filters'
import { AdminProductsListSection } from '@/modules/admin/ui/sections/admin-products-list-section'
import { AdminProductsToolbar } from '@/modules/admin/ui/sections/admin-products-toolbar'

export function AdminProductsView() {
	const p = useAdminProducts()

	return (
		<div className='space-y-4'>
			<AdminProductsToolbar
				productCount={p.products.length}
				isLoading={p.isLoading}
				isFetching={p.isFetching}
			/>

			<AdminProductsFilters
				search={p.search}
				onSearchChange={p.setSearch}
				status={p.status}
				onStatusChange={p.setStatus}
				hasFilters={p.hasFilters}
				onClearFilters={p.clearFilters}
			/>

			<AdminProductsBulkBar
				selectedCount={p.selected.size}
				pausePending={p.patchMutation.isPending}
				deletePending={p.deleteMutation.isPending}
				onPause={p.pauseSelected}
				onDelete={() => p.setConfirmBulkDelete(true)}
				onCancel={() => p.setSelected(new Set())}
			/>

			<AdminProductsListSection
				products={p.products}
				selected={p.selected}
				isLoading={p.isLoading}
				hasFilters={p.hasFilters}
				onToggleSelect={p.toggleSelect}
				onToggleSelectAll={p.toggleSelectAll}
				onPreview={p.setPreview}
				onPause={(id) =>
					p.patchMutation.mutate({
						id,
						body: { is_visible: false },
					})
				}
				onReactivate={(id) =>
					p.patchMutation.mutate({
						id,
						body: { is_visible: true },
					})
				}
				onDelete={p.setConfirmDelete}
			/>

			<AdminProductPreviewSheet
				preview={p.preview}
				onOpenChange={(open) => !open && p.setPreview(null)}
				onPause={(id) =>
					p.patchMutation.mutate({
						id,
						body: { is_visible: false },
					})
				}
				onReactivate={(id) =>
					p.patchMutation.mutate({
						id,
						body: { is_visible: true },
					})
				}
				onDelete={p.setConfirmDelete}
			/>

			<ConfirmDialog
				open={Boolean(p.confirmDelete)}
				onOpenChange={(open) => !open && p.setConfirmDelete(null)}
				title='Eliminar produto'
				description='Esta acção é irreversível. O produto será eliminado permanentemente.'
				confirmLabel='Eliminar'
				loading={p.deleteMutation.isPending}
				onConfirm={() =>
					p.confirmDelete &&
					p.deleteMutation.mutate([p.confirmDelete])
				}
			/>

			<ConfirmDialog
				open={p.confirmBulkDelete}
				onOpenChange={p.setConfirmBulkDelete}
				title={`Eliminar ${p.selected.size} produto${p.selected.size > 1 ? 's' : ''}?`}
				description='Esta acção é irreversível. Os produtos seleccionados serão eliminados permanentemente.'
				confirmLabel='Eliminar'
				loading={p.deleteMutation.isPending}
				onConfirm={() =>
					p.deleteMutation.mutate(Array.from(p.selected))
				}
			/>
		</div>
	)
}
