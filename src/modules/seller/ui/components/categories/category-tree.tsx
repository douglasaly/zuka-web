'use client'

import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CategoryRowActions } from './category-row-actions'
import type { Category, CategoryForm } from './types'
import { monogram } from './utils'

export function CategoryTree({
	visibleRoots,
	roots,
	isFiltering,
	query,
	form,
	childrenOf,
	onClearQuery,
	onMove,
	onEdit,
	onDelete,
}: {
	visibleRoots: Category[]
	roots: Category[]
	isFiltering: boolean
	query: string
	form: CategoryForm | null
	childrenOf: (parentId: string) => Category[]
	onClearQuery: () => void
	onMove: (list: Category[], index: number, direction: -1 | 1) => void
	onEdit: (cat: Category) => void
	onDelete: (cat: Category) => void
}) {
	return (
		<div className='min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
			<div className='flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3 sm:px-5'>
				<p className='font-heading text-sm font-semibold tracking-tight'>
					Categorias
				</p>
				<p className='text-xs tabular-nums text-muted-foreground'>
					{visibleRoots.length}
					{isFiltering ? ` de ${roots.length}` : ''} categoria
					{(isFiltering ? visibleRoots.length : roots.length) === 1
						? ''
						: 's'}
				</p>
			</div>

			{visibleRoots.length === 0 ? (
				<div className='px-6 py-14 text-center'>
					<p className='text-sm text-muted-foreground'>
						Nenhuma categoria corresponde à pesquisa.
					</p>
					{query ? (
						<Button
							variant='ghost'
							size='sm'
							className='mt-3 rounded-full'
							onClick={onClearQuery}
						>
							Limpar pesquisa
						</Button>
					) : null}
				</div>
			) : (
				<ul>
					{visibleRoots.map((cat, rootVisualIndex) => {
						const children = childrenOf(cat.id)
						const isActive = form?.id === cat.id
						const fullIndex = roots.findIndex(
							(r) => r.id === cat.id
						)

						return (
							<li
								key={cat.id}
								className={cn(
									rootVisualIndex > 0 &&
										'border-t border-border/50'
								)}
							>
								<div
									className={cn(
										'group flex min-h-14 min-w-0 items-center gap-3 px-3.5 py-3.5 transition-colors duration-150 sm:px-5',
										'hover:bg-muted/35',
										isActive &&
											'bg-foreground/4 ring-1 ring-inset ring-foreground/10'
									)}
								>
									<span
										className={cn(
											'flex size-10 shrink-0 items-center justify-center rounded-2xl font-heading text-sm font-bold tracking-tight transition-colors',
											isActive
												? 'bg-foreground text-background'
												: 'bg-muted text-foreground'
										)}
										aria-hidden
									>
										{monogram(cat.name)}
									</span>
									<div className='min-w-0 flex-1'>
										<div className='flex min-w-0 flex-wrap items-center gap-2'>
											<p className='truncate font-heading text-sm font-semibold tracking-tight'>
												{cat.name}
											</p>
											{children.length > 0 ? (
												<span className='rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground'>
													{children.length} sub
												</span>
											) : null}
										</div>
										<p className='mt-0.5 truncate font-mono text-[11px] text-muted-foreground'>
											/{cat.slug}
										</p>
									</div>
									<CategoryRowActions>
										<IconTooltipButton
											label='Mover para cima'
											disabled={
												isFiltering || fullIndex <= 0
											}
											onClick={() => {
												if (fullIndex > 0)
													onMove(roots, fullIndex, -1)
											}}
										>
											<ArrowUp className='size-4' />
										</IconTooltipButton>
										<IconTooltipButton
											label='Mover para baixo'
											disabled={
												isFiltering ||
												fullIndex >= roots.length - 1
											}
											onClick={() => {
												if (
													fullIndex >= 0 &&
													fullIndex < roots.length - 1
												)
													onMove(roots, fullIndex, 1)
											}}
										>
											<ArrowDown className='size-4' />
										</IconTooltipButton>
										<IconTooltipButton
											label='Editar categoria'
											onClick={() => onEdit(cat)}
										>
											<Pencil className='size-4' />
										</IconTooltipButton>
										<IconTooltipButton
											label='Eliminar categoria'
											className='text-destructive'
											onClick={() => onDelete(cat)}
										>
											<Trash2 className='size-4' />
										</IconTooltipButton>
									</CategoryRowActions>
								</div>

								{children.length > 0 ? (
									<ul className='relative bg-muted/25 pb-2'>
										<span
											className='absolute top-0 bottom-2 left-[1.85rem] w-px bg-border/80 sm:left-[2.15rem]'
											aria-hidden
										/>
										{children.map((child, childIndex) => {
											const childActive =
												form?.id === child.id
											return (
												<li
													key={child.id}
													className={cn(
														'group relative flex min-h-12 min-w-0 items-center gap-3 py-2.5 pr-3.5 pl-12 transition-colors duration-150 sm:pr-5 sm:pl-16',
														'hover:bg-muted/40',
														childActive &&
															'bg-foreground/3'
													)}
												>
													<span
														className='absolute top-1/2 left-[1.85rem] h-px w-3 -translate-y-1/2 bg-border/80 sm:left-[2.15rem] sm:w-4'
														aria-hidden
													/>
													<span
														className={cn(
															'flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold',
															childActive
																? 'bg-foreground text-background'
																: 'bg-background text-muted-foreground ring-1 ring-border/60'
														)}
														aria-hidden
													>
														{monogram(child.name)}
													</span>
													<div className='min-w-0 flex-1'>
														<p className='truncate text-sm font-medium'>
															{child.name}
														</p>
														<p className='truncate font-mono text-[11px] text-muted-foreground'>
															/{child.slug}
														</p>
													</div>
													<CategoryRowActions>
														<IconTooltipButton
															label='Mover para cima'
															disabled={
																childIndex === 0
															}
															onClick={() =>
																onMove(
																	children,
																	childIndex,
																	-1
																)
															}
														>
															<ArrowUp className='size-3.5' />
														</IconTooltipButton>
														<IconTooltipButton
															label='Mover para baixo'
															disabled={
																childIndex ===
																children.length -
																	1
															}
															onClick={() =>
																onMove(
																	children,
																	childIndex,
																	1
																)
															}
														>
															<ArrowDown className='size-3.5' />
														</IconTooltipButton>
														<IconTooltipButton
															label='Editar subcategoria'
															onClick={() =>
																onEdit(child)
															}
														>
															<Pencil className='size-3.5' />
														</IconTooltipButton>
														<IconTooltipButton
															label='Eliminar subcategoria'
															className='text-destructive'
															onClick={() =>
																onDelete(child)
															}
														>
															<Trash2 className='size-3.5' />
														</IconTooltipButton>
													</CategoryRowActions>
												</li>
											)
										})}
									</ul>
								) : null}
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
