'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createProduct } from '@/lib/api/marketplace'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'

interface Category {
	id: string
	name: string
}

interface CreateProductFormProps {
	categories: Category[]
	storeId: string
}

export function CreateProductForm({
	categories,
	storeId,
}: CreateProductFormProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({
		name: '',
		description: '',
		categoryId: '',
		price: '',
		discountPrice: '',
		quantity: '1',
		imageUrl: '',
	})

	const mutation = useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['seller-products', storeId],
			})
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			setForm({
				name: '',
				description: '',
				categoryId: '',
				price: '',
				discountPrice: '',
				quantity: '1',
				imageUrl: '',
			})
			setOpen(false)
		},
	})

	if (!open) {
		return (
			<Button
				type='button'
				className='rounded-xl'
				onClick={() => setOpen(true)}
			>
				<Plus className='size-4' />
				Publicar produto
			</Button>
		)
	}

	return (
		<form
			className='space-y-4 rounded-2xl border border-border/60 bg-card p-5'
			onSubmit={(e) => {
				e.preventDefault()
				mutation.mutate({
					name: form.name,
					description: form.description || undefined,
					categoryId: form.categoryId,
					price: Number(form.price),
					discountPrice: form.discountPrice
						? Number(form.discountPrice)
						: undefined,
					quantity: Number(form.quantity) || 1,
					imageUrl: form.imageUrl || undefined,
				})
			}}
		>
			<div className='flex items-center justify-between gap-3'>
				<h2 className='font-heading text-lg font-bold'>Novo produto</h2>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => setOpen(false)}
				>
					Cancelar
				</Button>
			</div>

			<p className='text-sm text-muted-foreground'>
				Os produtos são publicados pela sua loja. Compradores não podem
				criar anúncios no Zuka.
			</p>

			<div className='space-y-2'>
				<Label htmlFor='product-name'>Nome do produto</Label>
				<Input
					id='product-name'
					required
					value={form.name}
					onChange={(e) =>
						setForm((f) => ({ ...f, name: e.target.value }))
					}
					placeholder='Ex: Samsung Galaxy A15'
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='product-description'>Descrição</Label>
				<Textarea
					id='product-description'
					value={form.description}
					onChange={(e) =>
						setForm((f) => ({ ...f, description: e.target.value }))
					}
					placeholder='Detalhes, estado, entrega...'
				/>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<div className='space-y-2'>
					<Label htmlFor='product-category'>Categoria</Label>
					<select
						id='product-category'
						required
						className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
						value={form.categoryId}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								categoryId: e.target.value,
							}))
						}
					>
						<option value=''>Selecionar...</option>
						{categories.map((c) => (
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
						onChange={(e) =>
							setForm((f) => ({ ...f, quantity: e.target.value }))
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
							setForm((f) => ({ ...f, price: e.target.value }))
						}
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
							setForm((f) => ({
								...f,
								discountPrice: e.target.value,
							}))
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
				onChange={(imageUrl) =>
					setForm((f) => ({ ...f, imageUrl: imageUrl ?? '' }))
				}
			/>

			{mutation.error && (
				<p className='text-sm text-destructive'>
					{mutation.error.message}
				</p>
			)}

			<Button
				type='submit'
				className='w-full rounded-xl'
				disabled={mutation.isPending}
			>
				{mutation.isPending ? 'A publicar...' : 'Publicar na loja'}
			</Button>
		</form>
	)
}
