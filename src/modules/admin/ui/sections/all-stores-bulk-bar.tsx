'use client'

import { Button } from '@/components/ui/button'

type AllStoresBulkBarProps = {
	selectedCount: number
	onSuspend: () => void
	onDelete: () => void
}

export function AllStoresBulkBar({
	selectedCount,
	onSuspend,
	onDelete,
}: AllStoresBulkBarProps) {
	if (selectedCount === 0) return null

	return (
		<div className='flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2'>
			<span className='text-xs font-medium text-muted-foreground'>
				{selectedCount} selecionada
				{selectedCount > 1 ? 's' : ''}
			</span>
			<Button
				size='sm'
				variant='outline'
				type='button'
				onClick={onSuspend}
			>
				Suspender selecionadas
			</Button>
			<Button
				size='sm'
				type='button'
				className='bg-destructive/90 text-white hover:bg-destructive'
				onClick={onDelete}
			>
				Eliminar selecionadas
			</Button>
		</div>
	)
}
