'use client'

/**
 * THESIS: Product editor as a listing studio — photos lead, then identity,
 * commerce, and a clear publish control; refuses one stuffed mega-card.
 * OWN-WORLD: Seller dashboard sections + sticky save bar (same grammar as loja).
 * STORY: Photos → details → price → status → save.
 * FIRST VIEWPORT: Compact chrome + media dropzone.
 * FORM: Extend store-editor Operate grammar.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Eye, Loader2, Package, Save } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'
import { IconTooltipButton } from './icon-tooltip-button'
import {
	PRODUCT_STATUS_LABELS,
	PRODUCT_STATUS_STYLES,
	type ProductStatusValue,
} from './product-editor/constants'
import { ProductImagesField } from './product-editor/product-images-field'
import { ProductPreviewSheet } from './product-editor/product-preview-sheet'
import { ProductSection } from './product-editor/product-section'
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

function formsEqual(a: ProductFormState, b: ProductFormState) {
	return (
		a.name === b.name &&
		a.description === b.description &&
		a.categoryId === b.categoryId &&
		a.price === b.price &&
		a.discountPrice === b.discountPrice &&
		a.status === b.status &&
		a.imageUrls.length === b.imageUrls.length &&
		a.imageUrls.every((url, i) => url === b.imageUrls[i])
	)
}

export const ProductForm = ({
	mode,
	initialData,
	productId,
}: ProductFormProps) => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const baseline = initialData ?? EMPTY_PRODUCT_FORM
	const [form, setForm] = useState<ProductFormState>(baseline)
	const [previewOpen, setPreviewOpen] = useState(false)
	const [mediaUploading, setMediaUploading] = useState(false)

	const pageTitle =
		mode === 'create'
			? 'Novo produto'
			: form.name.trim() || baseline.name.trim() || 'Produto'

	useSetSellerPageMeta({
		title: pageTitle,
		crumbs:
			mode === 'create'
				? ['Dashboard', 'Produtos', 'Novo']
				: ['Dashboard', 'Produtos', pageTitle],
	})

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

	const isDirty = useMemo(() => !formsEqual(form, baseline), [form, baseline])

	const priceNum = Number(form.price) || 0
	const discountNum = form.discountPrice ? Number(form.discountPrice) : null
	const discountInvalid =
		discountNum != null &&
		discountNum > 0 &&
		priceNum > 0 &&
		discountNum >= priceNum

	const categoryName =
		categories?.find((c) => c.id === form.categoryId)?.name ?? null

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
			if (discountInvalid) {
				throw new Error(
					'O preço promocional deve ser inferior ao preço normal'
				)
			}

			const payload = {
				name: form.name.trim(),
				description: form.description.trim() || undefined,
				categoryId: form.categoryId,
				price: Number(form.price),
				discountPrice: form.discountPrice
					? Number(form.discountPrice)
					: undefined,
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
			<div className='space-y-5'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-9 w-40' />
					<Skeleton className='h-9 w-32 rounded-full' />
				</div>
				<Skeleton className='h-48 w-full rounded-2xl' />
				<div className='grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]'>
					<Skeleton className='h-72 w-full rounded-2xl' />
					<Skeleton className='h-56 w-full rounded-2xl' />
				</div>
			</div>
		)
	}

	const cover = form.imageUrls[0] ?? null
	const canSave =
		!mutation.isPending &&
		!mediaUploading &&
		(mode === 'create' || isDirty) &&
		!discountInvalid

	return (
		<div className='min-w-0 max-w-full space-y-6 pb-28'>
			{/* Chrome — title lives in top bar */}
			<div className='flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-3'>
				<div className='flex min-w-0 flex-1 items-center gap-2'>
					<IconTooltipButton
						label='Voltar aos produtos'
						href='/dashboard/seller/produtos'
					>
						<ArrowLeft className='size-4' />
					</IconTooltipButton>
					<p className='min-w-0 flex-1 text-sm leading-snug text-muted-foreground'>
						{mode === 'create'
							? 'Preencha os detalhes e publique quando estiver pronto.'
							: isDirty
								? 'Tem alterações por guardar.'
								: 'Sem alterações por guardar.'}
					</p>
				</div>
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='shrink-0 rounded-full'
					onClick={() => setPreviewOpen(true)}
				>
					<Eye className='size-3.5' />
					<span className='hidden sm:inline'>Pré-visualizar</span>
					<span className='sm:hidden'>Ver</span>
				</Button>
			</div>

			<form
				className='min-w-0 max-w-full space-y-6'
				onSubmit={(e) => {
					e.preventDefault()
					mutation.mutate()
				}}
			>
				<ProductSection
					title='Fotografias'
					description='Adicione as imagens do produto. A primeira imagem é a capa.'
				>
					<ProductImagesField
						urls={form.imageUrls}
						onChange={(imageUrls) => update('imageUrls', imageUrls)}
						disabled={mutation.isPending}
						onUploadingChange={setMediaUploading}
					/>
				</ProductSection>

				<div className='grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]'>
					<div className='min-w-0 space-y-6'>
						<ProductSection
							title='Detalhes'
							description='Nome, categoria e descrição que o comprador vê.'
						>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='product-name'>
										Nome do produto
									</Label>
									<Input
										id='product-name'
										required
										value={form.name}
										onChange={(e) =>
											update('name', e.target.value)
										}
										placeholder='Ex: Samsung Galaxy A15'
										className='h-11'
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='product-category'>
										Categoria
									</Label>
									<Select
										value={form.categoryId || null}
										onValueChange={(v) =>
											v && update('categoryId', v)
										}
									>
										<SelectTrigger
											id='product-category'
											className='h-11 w-full'
										>
											<SelectValue placeholder='Seleccionar categoria…' />
										</SelectTrigger>
										<SelectContent>
											{(categories ?? []).map((c) => (
												<SelectItem
													key={c.id}
													value={c.id}
												>
													{c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='product-description'>
										Descrição
									</Label>
									<Textarea
										id='product-description'
										value={form.description}
										onChange={(e) =>
											update(
												'description',
												e.target.value
											)
										}
										placeholder='Estado, medidas, entrega, o que torna este produto especial…'
										rows={6}
										className='min-h-32 resize-y'
									/>
								</div>
							</div>
						</ProductSection>

						<ProductSection
							title='Preço'
							description='Valores em meticais (MZN).'
						>
							<div className='grid gap-4 sm:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='product-price'>Preço</Label>
									<div className='relative'>
										<Input
											id='product-price'
											type='number'
											min={0}
											required
											value={form.price}
											onChange={(e) =>
												update('price', e.target.value)
											}
											className='h-11 pr-14'
											placeholder='0'
										/>
										<span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground'>
											MZN
										</span>
									</div>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='product-discount'>
										Preço promocional
										<span className='ml-1 font-normal text-muted-foreground'>
											(opcional)
										</span>
									</Label>
									<div className='relative'>
										<Input
											id='product-discount'
											type='number'
											min={0}
											value={form.discountPrice}
											onChange={(e) =>
												update(
													'discountPrice',
													e.target.value
												)
											}
											className={cn(
												'h-11 pr-14',
												discountInvalid &&
													'border-destructive focus-visible:ring-destructive/30'
											)}
											placeholder='—'
										/>
										<span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground'>
											MZN
										</span>
									</div>
								</div>
							</div>
							{discountInvalid ? (
								<p className='mt-3 text-xs text-destructive'>
									O preço promocional tem de ser inferior ao
									preço normal.
								</p>
							) : null}
						</ProductSection>
					</div>

					<div className='min-w-0 space-y-6 xl:sticky xl:top-24 xl:self-start'>
						<ProductSection
							title='Publicação'
							description='Controla se o produto aparece na loja.'
						>
							<ProductStatusField
								value={form.status}
								onChange={(status: ProductStatusValue) =>
									update('status', status)
								}
							/>
						</ProductSection>

						{/* Live summary */}
						<div className='overflow-hidden rounded-2xl border border-border/60 bg-card'>
							<div className='relative aspect-4/3 bg-muted'>
								{cover ? (
									<Image
										src={cover}
										alt=''
										fill
										className='object-cover'
										sizes='360px'
										placeholder='blur'
										blurDataURL={BLUR_PLACEHOLDER}
									/>
								) : (
									<div className='flex size-full flex-col items-center justify-center gap-2 text-muted-foreground'>
										<Package className='size-8' />
										<p className='text-xs'>Sem capa</p>
									</div>
								)}
							</div>
							<div className='space-y-2 p-4'>
								<div className='flex items-start justify-between gap-2'>
									<p className='line-clamp-2 font-heading text-sm font-semibold leading-snug'>
										{form.name.trim() || 'Nome do produto'}
									</p>
									<span
										className={cn(
											'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
											PRODUCT_STATUS_STYLES[
												form.status
											] ??
												'bg-muted text-muted-foreground'
										)}
									>
										{PRODUCT_STATUS_LABELS[form.status] ??
											form.status}
									</span>
								</div>
								<p className='text-xs text-muted-foreground'>
									{categoryName ?? 'Sem categoria'}
								</p>
								{priceNum > 0 ? (
									<div className='flex items-baseline gap-2 pt-1'>
										{discountNum != null &&
										discountNum > 0 &&
										!discountInvalid ? (
											<>
												<p className='text-lg font-bold tabular-nums'>
													{formatPrice(
														discountNum,
														'MZN'
													)}
												</p>
												<p className='text-xs text-muted-foreground line-through'>
													{formatPrice(
														priceNum,
														'MZN'
													)}
												</p>
											</>
										) : (
											<p className='text-lg font-bold tabular-nums'>
												{formatPrice(priceNum, 'MZN')}
											</p>
										)}
									</div>
								) : (
									<p className='pt-1 text-sm text-muted-foreground'>
										Defina um preço
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Sticky save bar */}
				<div className='fixed bottom-0 left-0 right-0 z-20 max-w-full border-t border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:left-(--sidebar-width)'>
					<div className='mx-auto flex w-full max-w-6xl min-w-0 flex-wrap items-center justify-end gap-2 px-4 py-3 sm:justify-between sm:gap-3 sm:px-6'>
						<p className='hidden min-w-0 flex-1 text-xs text-muted-foreground sm:block'>
							{mediaUploading
								? 'Aguarde o carregamento das imagens…'
								: form.status === 'ACTIVE'
									? 'Ao guardar como Activo, o produto fica visível no marketplace.'
									: 'O produto só fica público quando o estado for Activo.'}
						</p>
						<div className='flex shrink-0 flex-wrap items-center justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='rounded-full'
								render={
									<Link href='/dashboard/seller/produtos'>
										Cancelar
									</Link>
								}
							/>
							<Button
								type='submit'
								size='sm'
								className='rounded-full'
								disabled={!canSave}
							>
								{mutation.isPending ? (
									<>
										<Loader2 className='size-4 animate-spin' />
										A guardar…
									</>
								) : mediaUploading ? (
									<>
										<Loader2 className='size-4 animate-spin' />
										A carregar…
									</>
								) : (
									<>
										<Save className='size-4' />
										{mode === 'create'
											? 'Publicar'
											: 'Guardar'}
									</>
								)}
							</Button>
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
