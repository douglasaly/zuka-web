'use client'

import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	title: string
	description: string
	confirmLabel?: string
	onConfirm: () => void
	loading?: boolean
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = 'Confirmar',
	onConfirm,
	loading,
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-sm'>
				<div className='space-y-4'>
					<div className='space-y-1'>
						<p className='font-heading text-base font-bold'>{title}</p>
						<p className='text-sm text-muted-foreground'>{description}</p>
					</div>
					<div className='flex justify-end gap-2'>
						<DialogClose render={<Button variant='outline'>Cancelar</Button>} />
						<Button
							type='button'
							onClick={onConfirm}
							disabled={loading}
							className='bg-destructive/90 text-white hover:bg-destructive'
						>
							{loading ? 'A processar...' : confirmLabel}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
