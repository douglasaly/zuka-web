'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Package, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { formatPrice } from '@/utils/format-price'

type Product = {
	id: string
	name: string
	price: number
	discountPrice: number | null
	currency: string
	status: string
	isVisible: boolean
	categoryName: string | null
	image: string | null
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
	active: { label: 'Activo', color: 'bg-emerald-500/10 text-emerald-600' },
	inactive: {
		label: 'Inactivo',
		color: 'bg-amber-500/10 text-amber-600',
	},
	draft: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
}

export const SellerProductsView = () => {
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery<{ products: Product[] }>({
		queryKey: ['seller-products'],
		queryFn: async () => {
			const res = await fetch('/api/seller/products')
			if (!res.ok) throw new Error('Failed to load products')
			return res.json()
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/seller/products/${id}`, {
				method: 'DELETE',
			})
			if (!res.ok) throw new Error('Failed to delete product')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			setDeletingId(null)
		},
	})

	const products = data?.products ?? []

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4'
					>
						<Skeleton className='size-14 rounded-lg' />
						<div className='flex-1 space-y-1.5'>
							<Skeleton className='h-4 w-40' />
							<Skeleton className='h-3 w-24' />
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<p className='text-sm text-muted-foreground'>
					{products.length}{' '}
					{products.length === 1 ? 'produto' : 'produtos'}
				</p>
				<Button className='rounded-full' asChild>
					<Link href='/dashboard/seller/produtos/novo'>
						<Plus className='mr-1 size-4' />
						Novo produto
					</Link>
				</Button>
			</div>

			{products.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-24 text-center'>
					<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
						<Package className='size-8 text-muted-foreground' />
					</div>
					<h2 className='mt-4 font-heading text-xl font-bold'>
						Nenhum produto ainda
					</h2>
					<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
						Adicione o primeiro produto da sua loja.
					</p>
					<Button className='mt-6 rounded-full' asChild>
						<Link href='/dashboard/seller/produtos/novo'>
							<Plus className='mr-1 size-4' />
							Adicionar produto
						</Link>
					</Button>
				</div>
			) : (
				<div className='space-y-2'>
					{products.map((product) => {
						const statusConfig = STATUS_MAP[product.status] ?? {
							label: product.status,
							color: 'bg-muted text-muted-foreground',
						}

						return (
							<div
								key={product.id}
								className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-accent/50'
							>
								<div className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted'>
									{product.image ? (
										<Image
											src={product.image}
											alt={product.name}
											fill
											className='object-cover'
											sizes='56px'
											placeholder='blur'
											blurDataURL={BLUR_PLACEHOLDER}
										/>
									) : (
										<div className='flex size-full items-center justify-center'>
											<Package className='size-5 text-muted-foreground' />
										</div>
									)}
								</div>

								<div className='flex-1 min-w-0'>
									<p className='truncate font-medium'>
										{product.name}
									</p>
									<div className='mt-0.5 flex items-center gap-2 text-sm'>
										<span className='font-medium text-primary'>
											{formatPrice(
												product.price,
												product.currency
											)}
										</span>
										{product.categoryName && (
											<>
												<span className='text-muted-foreground'>
													&middot;
												</span>
												<span className='text-muted-foreground'>
													{product.categoryName}
												</span>
											</>
										)}
									</div>
								</div>

								<span
									className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${statusConfig.color}`}
								>
									{statusConfig.label}
								</span>

								<div className='flex items-center gap-1'>
									<Button
										variant='ghost'
										size='sm'
										className='rounded-full text-xs'
										asChild
									>
										<Link
											href={`/dashboard/seller/produtos/${product.id}/editar`}
										>
											Editar
										</Link>
									</Button>
									<Button
										variant='ghost'
										size='sm'
										className='rounded-full text-xs text-destructive hover:text-destructive'
										onClick={() =>
											setDeletingId(product.id)
										}
										disabled={deleteMutation.isPending}
									>
										{deletingId === product.id &&
										deleteMutation.isPending
											? 'A eliminar…'
											: 'Eliminar'}
									</Button>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{/* Confirm delete dialog */}
			{deletingId && !deleteMutation.isPending && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
					<div className='mx-4 w-full max-w-sm rounded-2xl border bg-card p-6 shadow-lg'>
						<div className='flex items-center gap-3'>
							<div className='flex size-10 items-center justify-center rounded-full bg-destructive/10'>
								<AlertCircle className='size-5 text-destructive' />
							</div>
							<div>
								<p className='font-medium'>Eliminar produto</p>
								<p className='text-sm text-muted-foreground'>
									Tem a certeza? Esta acção não pode ser
									desfeita.
								</p>
							</div>
						</div>
						<div className='mt-4 flex justify-end gap-2'>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								onClick={() => setDeletingId(null)}
							>
								Cancelar
							</Button>
							<Button
								variant='destructive'
								size='sm'
								className='rounded-full'
								onClick={() =>
									deletingId &&
									deleteMutation.mutate(deletingId)
								}
							>
								Eliminar
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
