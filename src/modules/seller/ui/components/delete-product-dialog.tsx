'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import type { SellerProduct } from '../../constants'

type DeleteProductDialogProps = {
	product: SellerProduct | null
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	isDeleting?: boolean
}

export const DeleteProductDialog = ({
	product,
	onOpenChange,
	onConfirm,
	isDeleting = false,
}: DeleteProductDialogProps) => {
	return (
		<Dialog open={!!product} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Eliminar produto?</DialogTitle>
					<DialogDescription>
						Tem a certeza que quer eliminar{' '}
						<span className='font-semibold text-foreground'>
							{product?.name}
						</span>
						? Esta ação não pode ser desfeita.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancelar
					</Button>
					<Button
						variant='destructive'
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? 'A eliminar...' : 'Sim, eliminar'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
