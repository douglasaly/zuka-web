'use client'
import type { SellerProduct } from '@/lib/types/api/seller'
import { OrdersPagination } from '@/modules/seller/ui/components/orders/orders-pagination'
import { SellerProductListItem } from '@/modules/seller/ui/components/products/seller-product-list-item'
import { SellerProductsEmpty } from '@/modules/seller/ui/sections/seller-products-empty'

type SellerProductsListSectionProps = {
	products: SellerProduct[]
	selected: Set<string>
	allSelected: boolean
	canUpdate: boolean
	canDelete: boolean
	canCreate: boolean
	hasFilters: boolean
	showPager: boolean
	currentPage: number
	totalPages: number
	onToggleAll: () => void
	onToggleOne: (id: string) => void
	onPreview: (product: SellerProduct) => void
	onDelete: (id: string) => void
	onClearFilters: () => void
	onPageChange: (page: number) => void
}
export function SellerProductsListSection({
	products,
	selected,
	allSelected,
	canUpdate,
	canDelete,
	canCreate,
	hasFilters,
	showPager,
	currentPage,
	totalPages,
	onToggleAll,
	onToggleOne,
	onPreview,
	onDelete,
	onClearFilters,
	onPageChange,
}: SellerProductsListSectionProps) {
	if (products.length === 0) {
		return (
			<SellerProductsEmpty
				hasFilters={hasFilters}
				canCreate={canCreate}
				onClearFilters={onClearFilters}
			/>
		)
	}
	return (
		<>
			<div className='overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
				<div className='flex items-center gap-3 border-b border-border/50 bg-muted/20 px-4 py-2.5'>
					<input
						type='checkbox'
						checked={allSelected}
						onChange={onToggleAll}
						className='size-4 rounded border-input accent-foreground'
						aria-label='Seleccionar todos'
					/>
					<span className='text-xs font-medium text-muted-foreground'>
						{selected.size > 0
							? `${selected.size} seleccionado${selected.size > 1 ? 's' : ''}`
							: 'Seleccionar'}
					</span>
				</div>

				<ul className='divide-y divide-border/40'>
					{products.map((product) => (
						<SellerProductListItem
							key={product.id}
							product={product}
							isSelected={selected.has(product.id)}
							canUpdate={canUpdate}
							canDelete={canDelete}
							onToggle={onToggleOne}
							onPreview={onPreview}
							onDelete={onDelete}
						/>
					))}
				</ul>
			</div>

			{showPager ? (
				<OrdersPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
				/>
			) : null}
		</>
	)
}
