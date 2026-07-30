'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import type { ProductStatusValue } from './product-editor/constants'
import { ProductImagesField } from './product-editor/product-images-field'
import { ProductPreviewSheet } from './product-editor/product-preview-sheet'
import { ProductStatusField } from './product-editor/product-status-field'
import {
	EMPTY_PRODUCT_FORM,
	type ProductFormState,
} from './product-editor/types'

type Category = {
	id: string
	name: string
}

interface ProductFormProps {
	mode: 'create' | 'edit'
	initialData?: ProductFormState
	productId?: string
}

export const ProductForm = ({
	mode,
	initialData,
	productId,
}: ProductFormProps) => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [form, setForm] = useState<ProductFormState>(
		initialData ?? EMPTY_PRODUCT_FORM
	)
	const [previewOpen, setPreviewOpen] = useState(false)

	const { data: categories, isLoading: categoriesLoading } = useQuery<
		Category[]
	>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			const json = await res.json()
			const rows = (json.data ?? json) as Array<Record<string, unknown>>
			return rows.map((row) => ({
				id: String(row.id),
				name: String(row.name),
			}))
		},
	})

	function update<K extends keyof ProductFormState>(
		key: K,
		value: ProductFormState[K]
	) {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	const mutation = useMutation({
		mutationFn: async () => {
			if (!form.name.trim()) throw new Error('Nome é obrigatório')
			if (!form.categoryId) throw new Error('Categoria é obrigatória')
			if (!form.price || Number(form.price) <= 0) {
				throw new Error('Preço inválido')
			}

			const payload = {
				name: form.name.trim(),
				description: form.description.trim() || undefined,
				categoryId: form.categoryId,
				price: Number(form.price),
				discountPrice: form.discountPrice
					? Number(form.discountPrice)
					: undefined,
				quantity: Number(form.quantity) || 0,
				status: form.status,
				imageUrls: form.imageUrls,
			}

			if (mode === 'edit' && productId) {
				const res = await fetch(`/api/seller/products/${productId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				})
				const json = await res.json().catch(() => ({}))
				if (!res.ok) {
					throw new Error(json.error ?? 'Erro ao actualizar produto')
				}
				return json
			}

			const res = await fetch('/api/products', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
			const json = await res.json()
			if (!res.ok) {
				throw new Error(
					json.error?.message ?? json.error ?? 'Erro ao criar produto'
				)
			}
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			if (productId) {
				queryClient.invalidateQueries({
					queryKey: ['seller-product', productId],
				})
			}
			toast.success(
				mode === 'create'
					? 'Produto publicado com sucesso'
					: 'Produto actualizado com sucesso'
			)
			router.push('/dashboard/seller/produtos')
		},
		onError: (err) => {
			toast.error(
				err instanceof Error ? err.message : 'Erro ao guardar produto'
			)
		},
	})

	if (categoriesLoading) {
		return (
			<div className='space-y-4'>
				<Skeleton className='h-10 w-48' />
				<Skeleton className='h-64 w-full rounded-xl' />
			</div>
		)
	}

	return (
		<div className='space-y-6 pb-8'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<div className='flex items-center gap-3'>
					<Button
						variant='ghost'
						size='icon'
						className='shrink-0'
						render={
							<Link href='/dashboard/seller/produtos'>
								<ArrowLeft className='size-4' />
							</Link>
						}
					/>
					<div>
						<p className='text-sm text-muted-foreground'>
							Produtos
						</p>
						<h1 className='font-heading text-xl font-bold'>
							{mode === 'create'
								? 'Novo produto'
								: 'Editar produto'}
						</h1>
					</div>
				</div>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='rounded-full'
					onClick={() => setPreviewOpen(true)}
				>
					<Eye className='size-3.5' />
					Pré-visualizar
				</Button>
			</div>

			<form
				className='grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]'
				onSubmit={(e) => {
					e.preventDefault()
					mutation.mutate()
				}}
			>
				<div className='space-y-5 rounded-xl border border-border/60 bg-card p-5 sm:p-6'>
					<div className='space-y-2'>
						<Label htmlFor='product-name'>Nome do produto</Label>
						<Input
							id='product-name'
							required
							value={form.name}
							onChange={(e) => update('name', e.target.value)}
							placeholder='Ex: Samsung Galaxy A15'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='product-description'>Descrição</Label>
						<Textarea
							id='product-description'
							value={form.description}
							onChange={(e) =>
								update('description', e.target.value)
							}
							placeholder='Detalhes, estado, entrega...'
							rows={5}
						/>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='product-category'>Categoria</Label>
							<select
								id='product-category'
								required
								className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								value={form.categoryId}
								onChange={(e) =>
									update('categoryId', e.target.value)
								}
							>
								<option value=''>Seleccionar...</option>
								{(categories ?? []).map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='product-quantity'>Stock</Label>
							<Input
								id='product-quantity'
								type='number'
								min={0}
								value={form.quantity}
								onChange={(e) =>
									update('quantity', e.target.value)
								}
							/>
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='product-price'>Preço (MZN)</Label>
							<Input
								id='product-price'
								type='number'
								min={0}
								required
								value={form.price}
								onChange={(e) =>
									update('price', e.target.value)
								}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='product-discount'>
								Preço promocional
							</Label>
							<Input
								id='product-discount'
								type='number'
								min={0}
								value={form.discountPrice}
								onChange={(e) =>
									update('discountPrice', e.target.value)
								}
							/>
						</div>
					</div>

					<ProductImagesField
						urls={form.imageUrls}
						onChange={(imageUrls) => update('imageUrls', imageUrls)}
						disabled={mutation.isPending}
					/>
				</div>

				<div className='space-y-5'>
					<div className='rounded-xl border border-border/60 bg-card p-5 sm:p-6'>
						<ProductStatusField
							value={form.status}
							onChange={(status: ProductStatusValue) =>
								update('status', status)
							}
						/>
					</div>

					<div className='rounded-xl border border-border/60 bg-card p-5 sm:p-6'>
						<p className='text-sm font-semibold'>Publicação</p>
						<p className='mt-1 text-xs text-muted-foreground'>
							{form.status === 'ACTIVE'
								? 'O produto ficará visível no marketplace.'
								: 'O produto não ficará activo na loja até mudar o estado.'}
						</p>
						<div className='mt-4 flex flex-wrap gap-2'>
							<Button
								type='submit'
								className='rounded-full'
								disabled={mutation.isPending}
							>
								{mutation.isPending ? (
									<>
										<Loader2 className='size-4 animate-spin' />
										A guardar…
									</>
								) : mode === 'create' ? (
									'Publicar produto'
								) : (
									'Guardar alterações'
								)}
							</Button>
							<Button
								type='button'
								variant='outline'
								className='rounded-full'
								render={
									<Link href='/dashboard/seller/produtos'>
										Cancelar
									</Link>
								}
							/>
						</div>
					</div>
				</div>
			</form>

			<ProductPreviewSheet
				open={previewOpen}
				onOpenChange={setPreviewOpen}
				form={form}
				categories={categories ?? []}
			/>
		</div>
	)
}
