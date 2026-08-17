'use client'
import { Pause, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AdminProductsBulkBarProps = {
	selectedCount: number
	pausePending: boolean
	deletePending: boolean
	onPause: () => void
	onDelete: () => void
	onCancel: () => void
}
export function AdminProductsBulkBar({
	selectedCount,
	pausePending,
	deletePending,
	onPause,
	onDelete,
	onCancel,
}: AdminProductsBulkBarProps) {
	if (selectedCount === 0) return null
	return (
		<div className='flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 sm:px-4'>
			<span className='text-xs font-medium text-muted-foreground'>
				{selectedCount} seleccionado
				{selectedCount > 1 ? 's' : ''}
			</span>
			<div className='ml-auto flex flex-wrap items-center gap-1.5'>
				<Button
					size='sm'
					variant='outline'
					type='button'
					onClick={onPause}
					disabled={pausePending}
				>
					<Pause className='size-3.5' />
					Pausar
				</Button>
				<Button
					size='sm'
					variant='destructive'
					type='button'
					onClick={onDelete}
					disabled={deletePending}
				>
					<Trash2 className='size-3.5' />
					Eliminar
				</Button>
				<Button
					size='sm'
					variant='ghost'
					type='button'
					onClick={onCancel}
				>
					Cancelar
				</Button>
			</div>
		</div>
	)
}
