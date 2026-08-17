'use client'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useSellerProducts } from '@/modules/seller/hooks/use-seller-products'
import { DeleteProductDialog } from '@/modules/seller/ui/components/delete-product-dialog'
import { ProductCatalogPreviewPanel } from '@/modules/seller/ui/components/products/product-catalog-preview-panel'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import { SellerProductsBulkBar } from '@/modules/seller/ui/sections/seller-products-bulk-bar'
import { SellerProductsFilters } from '@/modules/seller/ui/sections/seller-products-filters'
import { SellerProductsListSection } from '@/modules/seller/ui/sections/seller-products-list-section'
import { SellerProductsSkeleton } from '@/modules/seller/ui/sections/seller-products-skeleton'
import { SellerProductsToolbar } from '@/modules/seller/ui/sections/seller-products-toolbar'
import { formatPrice } from '@/utils/format-price'
export const SellerProductsView = () => {
	useSetSellerPageMeta({
		title: 'Produtos',
		crumbs: ['Dashboard', 'Produtos'],
	})
	const p = useSellerProducts()
	if (p.isLoading) return <SellerProductsSkeleton />
	return (
		<div className='relative min-w-0 max-w-full space-y-5'>
			<SellerProductsToolbar
				rangeLabel={p.rangeLabel}
				isFetching={p.isFetching}
				isLoading={p.isLoading}
				perPage={p.perPage}
				canCreate={p.canCreate}
				onPerPageChange={p.handlePerPageChange}
			/>

			<SellerProductsFilters
				statusFilter={p.statusFilter}
				onStatusChange={p.handleStatusChange}
				search={p.search}
				onSearchChange={p.setSearch}
				categoryFilter={p.categoryFilter}
				onCategoryChange={p.handleCategoryChange}
				categories={p.categories}
				showPriceFilters={p.showPriceFilters}
				onTogglePriceFilters={() => p.setShowPriceFilters((v) => !v)}
				minPrice={p.minPrice}
				maxPrice={p.maxPrice}
				onMinPriceChange={p.handleMinPriceChange}
				onMaxPriceChange={p.handleMaxPriceChange}
				hasFilters={p.hasFilters}
				onClearFilters={p.clearFilters}
			/>

			<SellerProductsListSection
				products={p.products}
				selected={p.selected}
				allSelected={p.allSelected}
				canUpdate={p.canUpdate}
				canDelete={p.canDelete}
				canCreate={p.canCreate}
				hasFilters={p.hasFilters}
				showPager={p.showPager}
				currentPage={p.currentPage}
				totalPages={p.totalPages}
				onToggleAll={p.toggleAll}
				onToggleOne={p.toggleOne}
				onPreview={p.openPreview}
				onDelete={p.setDeletingId}
				onClearFilters={p.clearFilters}
				onPageChange={p.goToPage}
			/>

			<SellerProductsBulkBar
				selectedCount={p.selected.size}
				canUpdate={p.canUpdate}
				canDelete={p.canDelete}
				isPending={p.bulkMutation.isPending}
				onActivate={() => p.bulkMutation.mutate('activate')}
				onDeactivate={() => p.bulkMutation.mutate('deactivate')}
				onDelete={() => p.setConfirmBulkDelete(true)}
				onCancel={() => p.setSelected(new Set())}
			/>

			<DeleteProductDialog
				product={
					p.deletingProduct
						? {
								id: p.deletingProduct.id,
								name: p.deletingProduct.name,
								price: formatPrice(
									p.deletingProduct.price,
									p.deletingProduct.currency
								),
								imageUrl: p.deletingProduct.image ?? '',
							}
						: null
				}
				onOpenChange={(open) => {
					if (!open) p.setDeletingId(null)
				}}
				onConfirm={() => {
					if (p.deletingId) p.deleteMutation.mutate(p.deletingId)
				}}
				isDeleting={p.deleteMutation.isPending}
			/>

			<DeleteProductDialog
				product={
					p.confirmBulkDelete
						? {
								id: 'bulk',
								name: `${p.selected.size} produto${p.selected.size > 1 ? 's' : ''}`,
								price: '',
								imageUrl: '',
							}
						: null
				}
				onOpenChange={(open) => {
					if (!open) p.setConfirmBulkDelete(false)
				}}
				onConfirm={() => p.bulkMutation.mutate('delete')}
				isDeleting={p.bulkMutation.isPending}
			/>

			<Sheet
				open={Boolean(p.preview)}
				onOpenChange={(open) => {
					if (!open) p.closePreview()
				}}
			>
				<SheetContent
					side='right'
					className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
				>
					{p.preview ? (
						<ProductCatalogPreviewPanel
							preview={p.preview}
							heroUrl={p.previewImage ?? p.preview.image}
							onSelectImage={p.setPreviewImage}
							onDelete={() => {
								const id = p.preview?.id
								if (id) p.setDeletingId(id)
							}}
							canUpdate={p.canUpdate}
							canDelete={p.canDelete}
						/>
					) : null}
				</SheetContent>
			</Sheet>
		</div>
	)
}
