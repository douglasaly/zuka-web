'use client'

/**
 * THESIS: Category tree as a living shelf index — monograms mark each shelf,
 * children hang on a rail, edit panel previews the slug; refuses flat muted
 * rows and a dashed empty box as the whole idea.
 * OWN-WORLD: Seller Operate (font-heading, rounded-2xl, restrained neutrals).
 * STORY: Scan shelves → reorder → open editor → save.
 * FIRST VIEWPORT: Intro strip + search + tree peak beside editor.
 * FORM: Amplify products/settings grammar already in the dashboard.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	ArrowDown,
	ArrowUp,
	FolderTree,
	Loader2,
	Pencil,
	Plus,
	Search,
	Trash2,
	X,
} from 'lucide-react'
import { useDeferredValue, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Slug } from '@/utils/slug'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

type Category = {
	id: string
	parentId: string | null
	name: string
	slug: string
	position: number
}

type CategoryForm = {
	id?: string
	name: string
	slug: string
	parentId: string
}

const EMPTY_FORM: CategoryForm = {
	name: '',
	slug: '',
	parentId: '',
}

function monogram(name: string) {
	const letter = name.trim().charAt(0)
	return letter ? letter.toLocaleUpperCase('pt-PT') : '?'
}

function CategoryFormPanel({
	form,
	roots,
	pending,
	onChange,
	onSave,
	onCancel,
}: {
	form: CategoryForm
	roots: Category[]
	pending: boolean
	onChange: (next: CategoryForm) => void
	onSave: () => void
	onCancel: () => void
}) {
	const isEdit = Boolean(form.id)
	const canSave = form.name.trim().length > 0 && !pending
	const slugPreview = form.slug.trim() || Slug(form.name) || 'slug'

	return (
		<section className='min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
			<div className='flex items-start gap-3 border-b border-border/50 bg-muted/30 px-4 py-4 sm:px-5'>
				<span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-foreground font-heading text-lg font-bold text-background'>
					{monogram(form.name || 'C')}
				</span>
				<div className='min-w-0 flex-1'>
					<h2 className='font-heading text-base font-bold tracking-tight'>
						{isEdit ? 'Editar categoria' : 'Nova categoria'}
					</h2>
					<p className='mt-0.5 text-xs text-muted-foreground'>
						{isEdit
							? 'Actualize como aparece nos produtos.'
							: 'Defina o nome e onde vive na árvore.'}
					</p>
				</div>
				<IconTooltipButton label='Fechar formulário' onClick={onCancel}>
					<X className='size-4' />
				</IconTooltipButton>
			</div>

			<div className='space-y-4 p-4 sm:p-5'>
				<div className='space-y-2'>
					<Label htmlFor='cat-name'>Nome</Label>
					<Input
						id='cat-name'
						value={form.name}
						onChange={(e) => {
							const name = e.target.value
							onChange({
								...form,
								name,
								slug: form.id ? form.slug : Slug(name),
							})
						}}
						placeholder='Ex: Electrónica'
						className='h-11'
						autoFocus
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='cat-slug'>Slug</Label>
					<div className='flex min-w-0 overflow-hidden rounded-xl border border-input bg-background'>
						<span className='flex shrink-0 items-center bg-muted/60 px-2.5 font-mono text-[11px] text-muted-foreground sm:px-3 sm:text-xs'>
							/
						</span>
						<Input
							id='cat-slug'
							value={form.slug}
							onChange={(e) =>
								onChange({
									...form,
									slug: Slug(e.target.value),
								})
							}
							placeholder='electronica'
							className='h-11 min-w-0 rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0'
						/>
					</div>
					<p className='text-xs text-muted-foreground'>
						Pré-visualização:{' '}
						<span className='font-mono text-foreground/80'>
							/{slugPreview}
						</span>
					</p>
				</div>

				<div className='space-y-2'>
					<Label>Categoria pai</Label>
					<Select
						value={form.parentId || 'none'}
						onValueChange={(value) =>
							value &&
							onChange({
								...form,
								parentId: value === 'none' ? '' : value,
							})
						}
					>
						<SelectTrigger className='h-11 w-full'>
							<SelectValue placeholder='Nenhuma (raiz)' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='none'>
								Nenhuma — categoria raiz
							</SelectItem>
							{roots
								.filter((c) => c.id !== form.id)
								.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='flex flex-wrap gap-2 border-t border-border/50 px-4 py-3.5 sm:px-5'>
				<Button
					className='rounded-full'
					disabled={!canSave}
					onClick={onSave}
				>
					{pending ? (
						<>
							<Loader2 className='size-4 animate-spin' />
							A guardar…
						</>
					) : isEdit ? (
						'Guardar alterações'
					) : (
						'Criar categoria'
					)}
				</Button>
				<Button
					variant='ghost'
					className='rounded-full'
					onClick={onCancel}
					disabled={pending}
				>
					Cancelar
				</Button>
			</div>
		</section>
	)
}

function RowActions({
	children,
}: {
	children: ReactNode
}) {
	return (
		<div className='flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
			{children}
		</div>
	)
}

export const SellerCategoriesView = () => {
	useSetSellerPageMeta({
		title: 'Categorias',
		crumbs: ['Dashboard', 'Produtos', 'Categorias'],
	})

	const queryClient = useQueryClient()
	const [form, setForm] = useState<CategoryForm | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
	const [query, setQuery] = useState('')
	const deferredQuery = useDeferredValue(query)

	const { data, isLoading, isError, refetch } = useQuery<{
		categories: Category[]
	}>({
		queryKey: ['seller-categories'],
		queryFn: async () => {
			const res = await fetch('/api/seller/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
	})

	const categories = data?.categories ?? []
	const roots = useMemo(
		() =>
			categories
				.filter((c) => !c.parentId)
				.sort(
					(a, b) =>
						a.position - b.position || a.name.localeCompare(b.name)
				),
		[categories]
	)

	function childrenOf(parentId: string) {
		return categories
			.filter((c) => c.parentId === parentId)
			.sort(
				(a, b) =>
					a.position - b.position || a.name.localeCompare(b.name)
			)
	}

	const visibleRoots = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase()
		if (!q) return roots
		return roots.filter((cat) => {
			const kids = categories.filter((c) => c.parentId === cat.id)
			return (
				cat.name.toLowerCase().includes(q) ||
				cat.slug.toLowerCase().includes(q) ||
				kids.some(
					(k) =>
						k.name.toLowerCase().includes(q) ||
						k.slug.toLowerCase().includes(q)
				)
			)
		})
	}, [roots, categories, deferredQuery])

	const isFiltering = deferredQuery.trim().length > 0
	const subCount = categories.length - roots.length

	const saveMutation = useMutation({
		mutationFn: async () => {
			if (!form?.name.trim()) throw new Error('O nome é obrigatório')
			if (form.id) {
				const res = await fetch('/api/seller/categories', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: form.id,
						name: form.name.trim(),
						slug: form.slug.trim() || Slug(form.name),
						parentId: form.parentId || null,
					}),
				})
				const json = await res.json()
				if (!res.ok)
					throw new Error(json.error ?? 'Não foi possível actualizar')
				return json
			}
			const res = await fetch('/api/seller/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name.trim(),
					slug: form.slug.trim() || undefined,
					parentId: form.parentId || null,
				}),
			})
			const json = await res.json()
			if (!res.ok)
				throw new Error(json.error ?? 'Não foi possível criar')
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			const wasEdit = Boolean(form?.id)
			setForm(null)
			toast.success(
				wasEdit ? 'Categoria actualizada' : 'Categoria criada'
			)
		},
		onError: (error: Error) => toast.error(error.message),
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch('/api/seller/categories', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			})
			const json = await res.json()
			if (!res.ok)
				throw new Error(json.error ?? 'Não foi possível eliminar')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			setDeleteTarget(null)
			if (form?.id && form.id === deleteTarget?.id) setForm(null)
			toast.success('Categoria eliminada')
		},
		onError: (error: Error) => toast.error(error.message),
	})

	const reorderMutation = useMutation({
		mutationFn: async (items: Array<{ id: string; position: number }>) => {
			const res = await fetch('/api/seller/categories', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ items }),
			})
			const json = await res.json()
			if (!res.ok)
				throw new Error(json.error ?? 'Não foi possível reordenar')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
		},
		onError: (error: Error) => toast.error(error.message),
	})

	function move(list: Category[], index: number, direction: -1 | 1) {
		const target = index + direction
		if (target < 0 || target >= list.length) return
		const next = [...list]
		const tmp = next[index]
		next[index] = next[target]
		next[target] = tmp
		reorderMutation.mutate(
			next.map((item, position) => ({ id: item.id, position }))
		)
	}

	function openCreate() {
		setForm({ ...EMPTY_FORM })
	}

	function openEdit(cat: Category) {
		setForm({
			id: cat.id,
			name: cat.name,
			slug: cat.slug,
			parentId: cat.parentId ?? '',
		})
	}

	if (isLoading) {
		return (
			<div className='min-w-0 max-w-6xl space-y-5'>
				<div className='flex justify-between gap-3'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-48' />
						<Skeleton className='h-3 w-32' />
					</div>
					<Skeleton className='h-10 w-36 rounded-full' />
				</div>
				<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]'>
					<Skeleton className='h-80 w-full rounded-2xl' />
					<Skeleton className='hidden h-72 w-full rounded-2xl lg:block' />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex min-w-0 max-w-6xl flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center'>
				<h2 className='font-heading text-lg font-bold tracking-tight'>
					Não foi possível carregar as categorias
				</h2>
				<p className='mt-1.5 text-sm text-muted-foreground'>
					Tente novamente dentro de momentos.
				</p>
				<Button
					className='mt-6 rounded-full'
					variant='outline'
					onClick={() => refetch()}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	const tree = (
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
							onClick={() => setQuery('')}
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
						const fullIndex = roots.findIndex((r) => r.id === cat.id)

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
									<RowActions>
										<IconTooltipButton
											label='Mover para cima'
											disabled={
												isFiltering || fullIndex <= 0
											}
											onClick={() => {
												if (fullIndex > 0)
													move(roots, fullIndex, -1)
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
													move(roots, fullIndex, 1)
											}}
										>
											<ArrowDown className='size-4' />
										</IconTooltipButton>
										<IconTooltipButton
											label='Editar categoria'
											onClick={() => openEdit(cat)}
										>
											<Pencil className='size-4' />
										</IconTooltipButton>
										<IconTooltipButton
											label='Eliminar categoria'
											className='text-destructive'
											onClick={() =>
												setDeleteTarget(cat)
											}
										>
											<Trash2 className='size-4' />
										</IconTooltipButton>
									</RowActions>
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
													<RowActions>
														<IconTooltipButton
															label='Mover para cima'
															disabled={
																childIndex === 0
															}
															onClick={() =>
																move(
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
																move(
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
																openEdit(child)
															}
														>
															<Pencil className='size-3.5' />
														</IconTooltipButton>
														<IconTooltipButton
															label='Eliminar subcategoria'
															className='text-destructive'
															onClick={() =>
																setDeleteTarget(
																	child
																)
															}
														>
															<Trash2 className='size-3.5' />
														</IconTooltipButton>
													</RowActions>
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

	return (
		<div className='min-w-0 max-w-6xl space-y-6 pb-10'>
			<div className='flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<div className='min-w-0'>
					<p className='text-sm leading-relaxed text-muted-foreground'>
						Organize os produtos em Categorias e Subcategorias.
					</p>
					{categories.length > 0 ? (
						<div className='mt-3 flex flex-wrap gap-2'>
							<span className='inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums'>
								{categories.length} no total
							</span>
							<span className='inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground'>
								{roots.length} categoria
								{roots.length === 1 ? '' : 's'}
							</span>
							{subCount > 0 ? (
								<span className='inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground'>
									{subCount} subcategoria
									{subCount === 1 ? '' : 's'}
								</span>
							) : null}
						</div>
					) : null}
				</div>
				<Button
					className='shrink-0 rounded-full'
					size='default'
					onClick={openCreate}
				>
					<Plus className='size-4' />
					Nova categoria
				</Button>
			</div>

			{categories.length === 0 ? (
				<div className='relative overflow-hidden rounded-2xl border border-border/60 bg-card px-6 py-16 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:py-20'>
					<div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-muted/40' />
					<div className='relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm'>
						<FolderTree className='size-7' />
					</div>
					<h2 className='relative mt-6 font-heading text-2xl font-bold tracking-tight'>
						Ainda sem categorias
					</h2>
					<p className='relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground'>
						Crie grupos como Vestuário ou Electrónica para os
						clientes encontrarem produtos mais depressa.
					</p>
					<Button
						className='relative mt-7 rounded-full'
						onClick={openCreate}
					>
						<Plus className='size-4' />
						Criar primeira categoria
					</Button>
				</div>
			) : (
				<>
					<div className='relative max-w-lg min-w-0'>
						<Search className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder='Pesquisar por nome ou slug…'
							className='h-11 rounded-full border-border/60 bg-card pl-10 pr-10 text-base shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:h-10 sm:text-sm'
							aria-label='Pesquisar categorias'
						/>
						{query ? (
							<span className='absolute top-1/2 right-2 -translate-y-1/2'>
								<IconTooltipButton
									label='Limpar pesquisa'
									className='size-8 text-muted-foreground'
									onClick={() => setQuery('')}
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
									pending={saveMutation.isPending}
									onChange={setForm}
									onSave={() => saveMutation.mutate()}
									onCancel={() => setForm(null)}
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
										pending={saveMutation.isPending}
										onChange={setForm}
										onSave={() => saveMutation.mutate()}
										onCancel={() => setForm(null)}
									/>
								</div>
							) : (
								<div className='flex min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
									<div className='border-b border-border/50 bg-muted/30 px-5 py-4'>
										<p className='font-heading text-sm font-semibold tracking-tight'>
											Editor
										</p>
										<p className='mt-0.5 text-xs text-muted-foreground'>
											Seleccione uma categoria ou crie
											outra.
										</p>
									</div>
									<div className='flex flex-1 flex-col items-center justify-center px-6 py-10 text-center'>
										<span className='flex size-14 items-center justify-center rounded-2xl bg-muted font-heading text-xl font-bold text-muted-foreground'>
											+
										</span>
										<p className='mt-4 max-w-48 text-sm leading-relaxed text-muted-foreground'>
											Clique numa linha para editar, ou
											comece uma nova.
										</p>
										<Button
											variant='outline'
											size='sm'
											className='mt-5 rounded-full'
											onClick={openCreate}
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
			)}

			{categories.length === 0 && form ? (
				<div className='mx-auto max-w-md animate-in fade-in-0 duration-200'>
					<CategoryFormPanel
						form={form}
						roots={roots}
						pending={saveMutation.isPending}
						onChange={setForm}
						onSave={() => saveMutation.mutate()}
						onCancel={() => setForm(null)}
					/>
				</div>
			) : null}

			<Dialog
				open={Boolean(deleteTarget)}
				onOpenChange={(open) => {
					if (!open && !deleteMutation.isPending) setDeleteTarget(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Eliminar categoria?</DialogTitle>
						<DialogDescription>
							Vai eliminar{' '}
							<span className='font-medium text-foreground'>
								{deleteTarget?.name}
							</span>
							. Subcategorias passam a categorias raiz. Se houver
							produtos nesta categoria, terá de os mover primeiro.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							className='rounded-full'
							disabled={deleteMutation.isPending}
							onClick={() => setDeleteTarget(null)}
						>
							Cancelar
						</Button>
						<Button
							variant='destructive'
							className='rounded-full'
							disabled={deleteMutation.isPending}
							onClick={() =>
								deleteTarget &&
								deleteMutation.mutate(deleteTarget.id)
							}
						>
							{deleteMutation.isPending
								? 'A eliminar…'
								: 'Eliminar categoria'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
