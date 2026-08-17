'use client'
import { Plus, Search, X } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CategoryFormPanel } from '@/modules/seller/ui/components/categories/category-form-panel'
import { CategoryTree } from '@/modules/seller/ui/components/categories/category-tree'
import type {
	Category,
	CategoryForm,
} from '@/modules/seller/ui/components/categories/types'
export function SellerCategoriesWorkspace({
	query,
	onQueryChange,
	onClearQuery,
	form,
	roots,
	visibleRoots,
	isFiltering,
	childrenOf,
	savePending,
	onFormChange,
	onSave,
	onCancelForm,
	onCreate,
	onMove,
	onEdit,
	onDelete,
}: {
	query: string
	onQueryChange: (value: string) => void
	onClearQuery: () => void
	form: CategoryForm | null
	roots: Category[]
	visibleRoots: Category[]
	isFiltering: boolean
	childrenOf: (parentId: string) => Category[]
	savePending: boolean
	onFormChange: (next: CategoryForm) => void
	onSave: () => void
	onCancelForm: () => void
	onCreate: () => void
	onMove: (list: Category[], index: number, direction: -1 | 1) => void
	onEdit: (cat: Category) => void
	onDelete: (cat: Category) => void
}) {
	const tree = (
		<CategoryTree
			visibleRoots={visibleRoots}
			roots={roots}
			isFiltering={isFiltering}
			query={query}
			form={form}
			childrenOf={childrenOf}
			onClearQuery={onClearQuery}
			onMove={onMove}
			onEdit={onEdit}
			onDelete={onDelete}
		/>
	)
	return (
		<>
			<div className='relative max-w-lg min-w-0'>
				<Search className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder='Pesquisar por nome ou slug…'
					className='h-11 rounded-full border-border/60 bg-card pl-10 pr-10 text-base shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:h-10 sm:text-sm'
					aria-label='Pesquisar categorias'
				/>
				{query ? (
					<span className='absolute top-1/2 right-2 -translate-y-1/2'>
						<IconTooltipButton
							label='Limpar pesquisa'
							className='size-8 text-muted-foreground'
							onClick={onClearQuery}
						>
							<X className='size-4' />
						</IconTooltipButton>
					</span>
				) : null}
			</div>

			<div className='grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:gap-8'>
				{form ? (
					<div className='animate-in fade-in-0 slide-in-from-top-1 duration-200 lg:hidden'>
						<CategoryFormPanel
							form={form}
							roots={roots}
							pending={savePending}
							onChange={onFormChange}
							onSave={onSave}
							onCancel={onCancelForm}
						/>
					</div>
				) : null}

				<div className='min-w-0'>{tree}</div>

				<div className='hidden min-w-0 lg:block'>
					{form ? (
						<div className='sticky top-24 animate-in fade-in-0 slide-in-from-right-1 duration-200'>
							<CategoryFormPanel
								form={form}
								roots={roots}
								pending={savePending}
								onChange={onFormChange}
								onSave={onSave}
								onCancel={onCancelForm}
							/>
						</div>
					) : (
						<div className='flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
							<div className='border-b border-border/50 bg-muted/30 px-5 py-4'>
								<p className='font-heading text-sm font-semibold tracking-tight'>
									Editor
								</p>
								<p className='mt-0.5 text-xs text-muted-foreground'>
									Seleccione uma categoria ou crie outra.
								</p>
							</div>
							<div className='flex flex-1 flex-col items-center justify-center px-6 py-10 text-center'>
								<span className='flex size-14 items-center justify-center rounded-2xl bg-muted font-heading text-xl font-bold text-muted-foreground'>
									+
								</span>
								<p className='mt-4 max-w-48 text-sm leading-relaxed text-muted-foreground'>
									Clique numa linha para editar, ou comece uma
									nova.
								</p>
								<Button
									variant='outline'
									size='sm'
									className='mt-5 rounded-full'
									onClick={onCreate}
								>
									<Plus className='size-3.5' />
									Nova categoria
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
