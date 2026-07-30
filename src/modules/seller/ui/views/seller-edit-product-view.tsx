'use client'

import { useQuery } from '@tanstack/react-query'
import { PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { SellerProductDetail } from '@/lib/types/api/seller'
import type { ProductStatusValue } from '../components/product-editor/constants'
import { ProductForm } from '../components/product-form'

interface SellerEditProductViewProps {
	id: string
}

export const SellerEditProductView = ({ id }: SellerEditProductViewProps) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['seller-product', id],
		queryFn: async () => {
			const res = await fetch(`/api/seller/products/${id}`)
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error ?? 'Failed to load product')
			}
			const json = await res.json()
			return json.product as SellerProductDetail
		},
	})

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<Skeleton className='h-10 w-48' />
				<Skeleton className='h-64 w-full rounded-xl' />
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<PackageSearch className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Produto não encontrado
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					O produto que procura não existe ou foi removido.
				</p>
				<Button
					className='mt-6 rounded-full'
					render={
						<Link href='/dashboard/seller/produtos'>
							Voltar aos produtos
						</Link>
					}
				/>
			</div>
		)
	}

	const status = (
		['DRAFT', 'ACTIVE', 'INACTIVE'].includes(data.status)
			? data.status
			: 'DRAFT'
	) as ProductStatusValue

	return (
		<ProductForm
			mode='edit'
			productId={id}
			initialData={{
				name: data.name,
				description: data.description ?? '',
				categoryId: data.categoryId,
				price: String(data.price),
				discountPrice:
					data.discountPrice != null
						? String(data.discountPrice)
						: '',
				status,
				imageUrls: data.images.map((img) => img.url),
			}}
		/>
	)
}
