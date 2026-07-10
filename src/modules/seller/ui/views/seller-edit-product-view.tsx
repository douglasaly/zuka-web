'use client'

import { useQuery } from '@tanstack/react-query'
import { PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductForm } from '../components/product-form'

interface SellerEditProductViewProps {
	id: string
}

export const SellerEditProductView = ({ id }: SellerEditProductViewProps) => {
	const { data, isLoading } = useQuery({
		queryKey: ['product', id],
		queryFn: async () => {
			const res = await fetch(`/api/products/${id}`)
			if (!res.ok) throw new Error('Failed to load product')
			const json = await res.json()
			return json.data as {
				product: Record<string, unknown>
				store: Record<string, unknown> | null
				category: Record<string, unknown> | null
				images: Array<Record<string, unknown>>
			}
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

	if (!data) {
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

	const product = data.product
	const primaryImage = (data.images ?? [])[0] as { url?: string } | undefined

	return (
		<ProductForm
			mode='edit'
			productId={id}
			initialData={{
				name: String(product.name ?? ''),
				description: String(product.description ?? ''),
				categoryId: String(
					(data.category as { id?: string } | null)?.id ?? ''
				),
				price: String(product.price ?? ''),
				discountPrice: String(product.discount_price ?? ''),
				quantity: String(product.quantity ?? '1'),
				imageUrl: primaryImage?.url ?? '',
			}}
		/>
	)
}
