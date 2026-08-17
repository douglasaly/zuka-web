'use client'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Category } from '@/modules/admin/hooks/use-admin-settings'

type AdminCategoryRowProps = {
	cat: Category
	editingCat: {
		id: string
		name: string
	} | null
	onEditingChange: (
		value: {
			id: string
			name: string
		} | null
	) => void
	onSave: (id: string, name: string) => void
	onDelete: (id: string) => void
	savePending: boolean
}
export function AdminCategoryRow({
	cat,
	editingCat,
	onEditingChange,
	onSave,
	onDelete,
	savePending,
}: AdminCategoryRowProps) {
	if (editingCat?.id === cat.id) {
		return (
			<div className='flex items-center justify-between gap-2 px-4 py-2.5'>
				<Input
					value={editingCat.name}
					onChange={(e) =>
						onEditingChange({
							...editingCat,
							name: e.target.value,
						})
					}
					className='flex-1 h-8 text-sm'
					autoFocus
				/>
				<div className='flex gap-1'>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size='sm'
									variant='ghost'
									type='button'
									aria-label='Guardar'
									className='text-emerald-600'
									onClick={() =>
										onSave(editingCat.id, editingCat.name)
									}
									disabled={savePending}
								>
									<Check className='size-3.5' />
								</Button>
							}
						/>
						<TooltipContent>Guardar</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size='sm'
									variant='ghost'
									type='button'
									aria-label='Cancelar'
									onClick={() => onEditingChange(null)}
								>
									<X className='size-3.5' />
								</Button>
							}
						/>
						<TooltipContent>Cancelar</TooltipContent>
					</Tooltip>
				</div>
			</div>
		)
	}
	return (
		<div className='flex items-center justify-between gap-2 px-4 py-2.5'>
			<span className='text-sm font-medium flex-1'>{cat.name}</span>
			<span className='text-xs text-muted-foreground'>{cat.slug}</span>
			<div className='flex gap-1'>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								size='sm'
								variant='ghost'
								type='button'
								aria-label='Editar categoria'
								onClick={() =>
									onEditingChange({
										id: cat.id,
										name: cat.name,
									})
								}
							>
								<Pencil className='size-3.5' />
							</Button>
						}
					/>
					<TooltipContent>Editar</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								size='sm'
								variant='ghost'
								type='button'
								aria-label='Eliminar categoria'
								className='text-destructive'
								onClick={() => onDelete(cat.id)}
							>
								<Trash2 className='size-3.5' />
							</Button>
						}
					/>
					<TooltipContent>Eliminar</TooltipContent>
				</Tooltip>
			</div>
		</div>
	)
}
