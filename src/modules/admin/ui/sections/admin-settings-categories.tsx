'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '@/modules/admin/hooks/use-admin-settings'
import { AdminCategoryRow } from '@/modules/admin/ui/components/settings/admin-category-row'

type AdminSettingsCategoriesProps = {
	cats: Category[]
	catsLoading: boolean
	newCatName: string
	onNewCatNameChange: (value: string) => void
	editingCat: { id: string; name: string } | null
	onEditingChange: (value: { id: string; name: string } | null) => void
	onRequestDelete: (id: string) => void
	addCatMutation: UseMutationResult<unknown, Error, void, unknown>
	editCatMutation: UseMutationResult<
		void,
		Error,
		{ id: string; name: string },
		unknown
	>
}

export function AdminSettingsCategories({
	cats,
	catsLoading,
	newCatName,
	onNewCatNameChange,
	editingCat,
	onEditingChange,
	onRequestDelete,
	addCatMutation,
	editCatMutation,
}: AdminSettingsCategoriesProps) {
	return (
		<section className='space-y-3'>
			<div>
				<p className='font-heading font-bold'>Categorias</p>
				<p className='text-sm text-muted-foreground'>
					Gerir as categorias de produtos e lojas
				</p>
			</div>

			<form
				className='flex gap-2'
				onSubmit={(e) => {
					e.preventDefault()
					if (newCatName.trim()) addCatMutation.mutate()
				}}
			>
				<Input
					value={newCatName}
					onChange={(e) => onNewCatNameChange(e.target.value)}
					placeholder='Nome da nova categoria...'
					className='flex-1'
				/>
				<Button
					type='submit'
					disabled={!newCatName.trim() || addCatMutation.isPending}
				>
					<Plus className='size-4' />
					Adicionar
				</Button>
			</form>

			{catsLoading ? (
				<div className='space-y-2'>
					{Array.from({ length: 5 }, (_, i) => (
						<Skeleton key={i} className='h-12 rounded-xl' />
					))}
				</div>
			) : (
				<div className='rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40'>
					{cats.length === 0 && (
						<p className='py-8 text-center text-sm text-muted-foreground'>
							Sem categorias.
						</p>
					)}
					{cats.map((cat) => (
						<AdminCategoryRow
							key={cat.id}
							cat={cat}
							editingCat={editingCat}
							onEditingChange={onEditingChange}
							onSave={(id, name) =>
								editCatMutation.mutate({ id, name })
							}
							onDelete={onRequestDelete}
							savePending={editCatMutation.isPending}
						/>
					))}
				</div>
			)}
		</section>
	)
}
