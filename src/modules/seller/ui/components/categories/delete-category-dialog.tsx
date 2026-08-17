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
import type { Category } from './types'
export function DeleteCategoryDialog({
	target,
	pending,
	onOpenChange,
	onConfirm,
}: {
	target: Category | null
	pending: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
}) {
	return (
		<Dialog
			open={Boolean(target)}
			onOpenChange={(open) => {
				if (!open && !pending) onOpenChange(false)
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Eliminar categoria?</DialogTitle>
					<DialogDescription>
						Vai eliminar{' '}
						<span className='font-medium text-foreground'>
							{target?.name}
						</span>
						. Subcategorias passam a categorias raiz. Se houver
						produtos nesta categoria, terá de os mover primeiro.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant='outline'
						className='rounded-full'
						disabled={pending}
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						variant='destructive'
						className='rounded-full'
						disabled={pending}
						onClick={onConfirm}
					>
						{pending ? 'A eliminar…' : 'Eliminar categoria'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
