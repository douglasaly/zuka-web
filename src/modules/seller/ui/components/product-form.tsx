'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'

type Category = {
	id: string
	name: string
}

type ProductFormData = {
	name: string
	description: string
	categoryId: string
	price: string
	discountPrice: string
	quantity: string
	imageUrl: string
}

interface ProductFormProps {
	mode: 'create' | 'edit'
	initialData?: ProductFormData
	productId?: string
}

const EMPTY_FORM: ProductFormData = {
	name: '',
	description: '',
	categoryId: '',
	price: '',
	discountPrice: '',
	quantity: '1',
	imageUrl: '',
}

function useCategories() {
	return useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			const json = await res.json()
			return json.data ?? json
		},
	})
}

export const ProductForm = ({
	mode,
	initialData,
	productId,
}: ProductFormProps) => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [form, setForm] = useState<ProductFormData>(initialData ?? EMPTY_FORM)

	const { data: categories, isLoading: categoriesLoading } = useCategories()

	const mutation = useMutation({
		mutationFn: async () => {
			if (mode === 'edit' && productId) {
				const res = await fetch(`/api/seller/products/${productId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: form.name,
						description: form.description || undefined,
						categoryId: form.categoryId,
						price: Number(form.price),
						discountPrice: form.discountPrice
							? Number(form.discountPrice)
							: undefined,
						quantity: Number(form.quantity) || 1,
						imageUrl: form.imageUrl || undefined,
					}),
				})
				if (!res.ok) {
					const json = await res.json().catch(() => ({}))
					throw new Error(json.error ?? 'Erro ao actualizar produto')
				}
				return res.json()
			}

			const res = await fetch('/api/products', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name,
					description: form.description || undefined,
					categoryId: form.categoryId,
					price: Number(form.price),
					discountPrice: form.discountPrice
						? Number(form.discountPrice)
						: undefined,
					quantity: Number(form.quantity) || 1,
					imageUrl: form.imageUrl || undefined,
				}),
			})

			const json = await res.json()
			if (!res.ok) {
				throw new Error(json.error ?? 'Erro ao criar produto')
			}
			return json
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
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

	const update = <K extends keyof ProductFormData>(
		key: K,
		value: ProductFormData[K]
	) => {
		setForm((prev) => ({ ...prev, [key]: value }))
	}

	if (categoriesLoading) {
		return (
			<div className='space-y-4'>
				<Skeleton className='h-10 w-48' />
				<Skeleton className='h-64 w-full rounded-xl' />
			</div>
		)
	}

	return (
		<div className='space-y-6'>
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
					<p className='text-sm text-muted-foreground'>Produtos</p>
					<h1 className='font-heading text-xl font-bold'>
						{mode === 'create' ? 'Novo produto' : 'Editar produto'}
					</h1>
				</div>
			</div>

			<form
				className='max-w-2xl space-y-5 rounded-xl border border-border/60 bg-card p-6'
				onSubmit={(e) => {
					e.preventDefault()
					mutation.mutate()
				}}
			>
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
						onChange={(e) => update('description', e.target.value)}
						placeholder='Detalhes, estado, entrega...'
						rows={4}
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
							<option value=''>Selecionar...</option>
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
							min={1}
							value={form.quantity}
							onChange={(e) => update('quantity', e.target.value)}
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
							onChange={(e) => update('price', e.target.value)}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='product-discount'>
							Preço promocional (opcional)
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

				<FileUploadCard
					label='Imagem do produto'
					hint='Carregar foto do produto'
					variant='banner'
					purpose='product-image'
					value={form.imageUrl || null}
					onChange={(url) => update('imageUrl', url ?? '')}
				/>

				<div className='flex items-center gap-3 pt-2'>
					<Button
						type='submit'
						className='rounded-full'
						disabled={mutation.isPending}
					>
						{mutation.isPending
							? 'A guardar…'
							: mode === 'create'
								? 'Publicar na loja'
								: 'Guardar alterações'}
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

				{mutation.error && (
					<p className='text-sm text-destructive'>
						{mutation.error.message}
					</p>
				)}
			</form>
		</div>
	)
}
