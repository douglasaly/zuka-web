'use client'
import { Pause, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SellerProductsBulkBarProps = {
	selectedCount: number
	canUpdate: boolean
	canDelete: boolean
	isPending: boolean
	onActivate: () => void
	onDeactivate: () => void
	onDelete: () => void
	onCancel: () => void
}
export function SellerProductsBulkBar({
	selectedCount,
	canUpdate,
	canDelete,
	isPending,
	onActivate,
	onDeactivate,
	onDelete,
	onCancel,
}: SellerProductsBulkBarProps) {
	if (selectedCount === 0) return null
	return (
		<div className='sticky bottom-4 z-20'>
			<div className='flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-background/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm'>
				<p className='text-sm font-medium'>
					{selectedCount} seleccionado
					{selectedCount > 1 ? 's' : ''}
				</p>
				<div className='ml-auto flex flex-wrap items-center gap-1.5'>
					{canUpdate ? (
						<>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								disabled={isPending}
								onClick={onActivate}
							>
								<Play className='size-3.5' />
								Activar
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								disabled={isPending}
								onClick={onDeactivate}
							>
								<Pause className='size-3.5' />
								Pausar
							</Button>
						</>
					) : null}
					{canDelete ? (
						<Button
							variant='destructive'
							size='sm'
							className='rounded-full'
							disabled={isPending}
							onClick={onDelete}
						>
							<Trash2 className='size-3.5' />
							Eliminar
						</Button>
					) : null}
					<Button
						variant='ghost'
						size='sm'
						className='rounded-full'
						onClick={onCancel}
					>
						Cancelar
					</Button>
				</div>
			</div>
		</div>
	)
}
