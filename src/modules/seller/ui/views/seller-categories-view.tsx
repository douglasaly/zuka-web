'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	ArrowDown,
	ArrowUp,
	FolderTree,
	Pencil,
	Plus,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Slug } from '@/utils/slug'

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

export const SellerCategoriesView = () => {
	const queryClient = useQueryClient()
	const [form, setForm] = useState<CategoryForm | null>(null)

	const { data, isLoading } = useQuery<{ categories: Category[] }>({
		queryKey: ['seller-categories'],
		queryFn: async () => {
			const res = await fetch('/api/seller/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
	})

	const categories = data?.categories ?? []
	const roots = categories
		.filter((c) => !c.parentId)
		.sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))

	function childrenOf(parentId: string) {
		return categories
			.filter((c) => c.parentId === parentId)
			.sort(
				(a, b) =>
					a.position - b.position || a.name.localeCompare(b.name)
			)
	}

	const saveMutation = useMutation({
		mutationFn: async () => {
			if (!form?.name.trim()) throw new Error('Nome é obrigatório')
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
				if (!res.ok) throw new Error(json.error ?? 'Erro ao actualizar')
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
			if (!res.ok) throw new Error(json.error ?? 'Erro ao criar')
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			setForm(null)
			toast.success(
				form?.id ? 'Categoria actualizada' : 'Categoria criada'
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
			if (!res.ok) throw new Error(json.error ?? 'Erro ao eliminar')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-categories'] })
			queryClient.invalidateQueries({ queryKey: ['categories'] })
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
			if (!res.ok) throw new Error(json.error ?? 'Erro ao reordenar')
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

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className='h-14 w-full rounded-xl' />
				))}
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div>
					<h1 className='font-heading text-xl font-bold'>
						Categorias
					</h1>
					<p className='text-sm text-muted-foreground'>
						Crie, edite e reordene as categorias dos produtos.
					</p>
				</div>
				<Button
					className='rounded-full'
					onClick={() => setForm({ ...EMPTY_FORM })}
				>
					<Plus className='size-4' />
					Nova categoria
				</Button>
			</div>

			{form ? (
				<div className='rounded-xl border border-border/60 bg-card p-5'>
					<h2 className='font-heading text-base font-semibold'>
						{form.id ? 'Editar categoria' : 'Nova categoria'}
					</h2>
					<div className='mt-4 grid gap-4 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='cat-name'>Nome</Label>
							<Input
								id='cat-name'
								value={form.name}
								onChange={(e) => {
									const name = e.target.value
									setForm((prev) =>
										prev
											? {
													...prev,
													name,
													slug: prev.id
														? prev.slug
														: Slug(name),
												}
											: prev
									)
								}}
								placeholder='Ex: Electrónica'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='cat-slug'>Slug</Label>
							<Input
								id='cat-slug'
								value={form.slug}
								onChange={(e) =>
									setForm((prev) =>
										prev
											? {
													...prev,
													slug: Slug(e.target.value),
												}
											: prev
									)
								}
								placeholder='electronica'
							/>
						</div>
						<div className='space-y-2 sm:col-span-2'>
							<Label>Categoria pai (opcional)</Label>
							<Select
								value={form.parentId || 'none'}
								onValueChange={(value) =>
									value &&
									setForm((prev) =>
										prev
											? {
													...prev,
													parentId:
														value === 'none'
															? ''
															: value,
												}
											: prev
									)
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Nenhuma (raiz)' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>
										Nenhuma (raiz)
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
					<div className='mt-4 flex flex-wrap gap-2'>
						<Button
							className='rounded-full'
							disabled={saveMutation.isPending}
							onClick={() => saveMutation.mutate()}
						>
							{saveMutation.isPending
								? 'A guardar...'
								: 'Guardar'}
						</Button>
						<Button
							variant='outline'
							className='rounded-full'
							onClick={() => setForm(null)}
						>
							Cancelar
						</Button>
					</div>
				</div>
			) : null}

			{roots.length === 0 ? (
				<div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center'>
					<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
						<FolderTree className='size-8 text-muted-foreground' />
					</div>
					<h2 className='mt-4 font-heading text-xl font-bold'>
						Nenhuma categoria
					</h2>
					<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
						Crie a primeira categoria para organizar os produtos.
					</p>
				</div>
			) : (
				<div className='space-y-2'>
					{roots.map((cat, index) => {
						const children = childrenOf(cat.id)
						return (
							<div
								key={cat.id}
								className='rounded-xl border border-border/60 bg-card'
							>
								<div className='flex items-center gap-3 px-4 py-3.5 sm:px-5'>
									<div className='flex size-9 items-center justify-center rounded-lg bg-primary/10'>
										<FolderTree className='size-4 text-primary' />
									</div>
									<div className='min-w-0 flex-1'>
										<p className='font-medium'>
											{cat.name}
										</p>
										<p className='text-xs text-muted-foreground'>
											/{cat.slug}
											{children.length > 0
												? ` · ${children.length} subcategorias`
												: ''}
										</p>
									</div>
									<div className='flex items-center gap-1'>
										<Button
											variant='ghost'
											size='icon-sm'
											disabled={index === 0}
											onClick={() =>
												move(roots, index, -1)
											}
											aria-label='Subir'
										>
											<ArrowUp className='size-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon-sm'
											disabled={
												index === roots.length - 1
											}
											onClick={() =>
												move(roots, index, 1)
											}
											aria-label='Descer'
										>
											<ArrowDown className='size-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon-sm'
											onClick={() =>
												setForm({
													id: cat.id,
													name: cat.name,
													slug: cat.slug,
													parentId: '',
												})
											}
											aria-label='Editar'
										>
											<Pencil className='size-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon-sm'
											className='text-destructive'
											onClick={() =>
												deleteMutation.mutate(cat.id)
											}
											aria-label='Eliminar'
										>
											<Trash2 className='size-4' />
										</Button>
									</div>
								</div>

								{children.length > 0 ? (
									<div className='space-y-1 border-t border-border/40 px-3 py-2 sm:px-4'>
										{children.map((child, childIndex) => (
											<div
												key={child.id}
												className='flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/40'
											>
												<div className='size-1.5 rounded-full bg-muted-foreground/40' />
												<div className='min-w-0 flex-1'>
													<p className='text-sm font-medium'>
														{child.name}
													</p>
													<p className='text-xs text-muted-foreground'>
														/{child.slug}
													</p>
												</div>
												<div className='flex items-center gap-1'>
													<Button
														variant='ghost'
														size='icon-sm'
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
													</Button>
													<Button
														variant='ghost'
														size='icon-sm'
														disabled={
															childIndex ===
															children.length - 1
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
													</Button>
													<Button
														variant='ghost'
														size='icon-sm'
														onClick={() =>
															setForm({
																id: child.id,
																name: child.name,
																slug: child.slug,
																parentId:
																	child.parentId ??
																	'',
															})
														}
													>
														<Pencil className='size-3.5' />
													</Button>
													<Button
														variant='ghost'
														size='icon-sm'
														className='text-destructive'
														onClick={() =>
															deleteMutation.mutate(
																child.id
															)
														}
													>
														<Trash2 className='size-3.5' />
													</Button>
												</div>
											</div>
										))}
									</div>
								) : null}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
