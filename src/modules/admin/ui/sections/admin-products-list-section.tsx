'use client'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { AdminProductRow } from '@/modules/admin/ui/components/products/admin-product-row'
import type { AdminProduct } from '@/modules/admin/ui/components/products/constants'
import { TableSkeleton } from '@/modules/admin/ui/components/table-skeleton'
import { AdminProductsEmpty } from '@/modules/admin/ui/sections/admin-products-empty'

type AdminProductsListSectionProps = {
	products: AdminProduct[]
	selected: Set<string>
	isLoading: boolean
	hasFilters: boolean
	onToggleSelect: (id: string) => void
	onToggleSelectAll: () => void
	onPreview: (product: AdminProduct) => void
	onPause: (id: string) => void
	onReactivate: (id: string) => void
	onDelete: (id: string) => void
}
export function AdminProductsListSection({
	products,
	selected,
	isLoading,
	hasFilters,
	onToggleSelect,
	onToggleSelectAll,
	onPreview,
	onPause,
	onReactivate,
	onDelete,
}: AdminProductsListSectionProps) {
	if (isLoading) {
		return <TableSkeleton rows={8} cols={7} />
	}
	if (products.length === 0) {
		return <AdminProductsEmpty hasFilters={hasFilters} />
	}
	return (
		<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
			<Table>
				<TableHeader>
					<TableRow className='hover:bg-transparent'>
						<TableHead className='w-10'>
							<input
								type='checkbox'
								className='size-4 accent-primary'
								checked={
									selected.size === products.length &&
									products.length > 0
								}
								onChange={onToggleSelectAll}
								aria-label='Seleccionar todos'
							/>
						</TableHead>
						<TableHead>Produto</TableHead>
						<TableHead className='hidden md:table-cell'>
							Loja
						</TableHead>
						<TableHead className='hidden lg:table-cell'>
							Categoria
						</TableHead>
						<TableHead>Preço</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead className='hidden xl:table-cell'>
							Criado
						</TableHead>
						<TableHead className='w-[1%] text-right'>
							<span className='sr-only'>Acções</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map((product) => (
						<AdminProductRow
							key={product.id as string}
							product={product}
							isSelected={selected.has(product.id as string)}
							onToggleSelect={onToggleSelect}
							onPreview={onPreview}
							onPause={onPause}
							onReactivate={onReactivate}
							onDelete={onDelete}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
