'use client'

import { Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/modules/profile/ui/components/empty-state'
import type { SellerProduct } from '../../constants'
import { DeleteProductDialog } from '../components/delete-product-dialog'
import { SellerProductRow } from '../components/seller-product-row'

type SellerProductsSectionProps = {
	products: SellerProduct[]
	onAdd: () => void
	onEdit: (id: string) => void
	onDelete: (id: string) => void
}

export const SellerProductsSection = ({
	products,
	onAdd,
	onEdit,
	onDelete,
}: SellerProductsSectionProps) => {
	const [productToDelete, setProductToDelete] =
		useState<SellerProduct | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const handleConfirmDelete = async () => {
		if (!productToDelete) return

		setIsDeleting(true)
		try {
			onDelete(productToDelete.id)
			setProductToDelete(null)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>
					{products.length}{' '}
					{products.length === 1 ? 'produto' : 'produtos'}
				</h2>

				<Button
					onClick={onAdd}
					className='rounded-full bg-neutral-900 px-5 hover:bg-neutral-800'
				>
					<Plus className='size-4' />
					Adicionar
				</Button>
			</div>

			{products.length === 0 ? (
				<EmptyState
					icon={Package}
					title='Ainda não tem produtos'
					description='Adicione o seu primeiro produto para começar a vender'
				/>
			) : (
				<div className='space-y-3'>
					{products.map((product) => (
						<SellerProductRow
							key={product.id}
							product={product}
							onEdit={onEdit}
							onDelete={() => setProductToDelete(product)}
						/>
					))}
				</div>
			)}

			<DeleteProductDialog
				product={productToDelete}
				onOpenChange={(open) => !open && setProductToDelete(null)}
				onConfirm={handleConfirmDelete}
				isDeleting={isDeleting}
			/>
		</div>
	)
}
