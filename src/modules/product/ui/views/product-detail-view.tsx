'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	fetchProduct,
	fetchProducts,
	PRODUCT_PLACEHOLDER,
} from '@/lib/api/marketplace'
import { ProductActions } from '../components/product-actions'
import { ProductDescription } from '../components/product-description'
import { ProductDetailSkeleton } from '../components/product-detail-skeleton'
import { ProductGallery } from '../components/product-gallery'
import { ProductHeader } from '../components/product-header'
import { ProductPrice } from '../components/product-price'
import { ProductStoreCard } from '../components/product-store-card'
import { RelatedProducts } from '../components/related-products'

interface ProductDetailViewProps {
	id: string
}

export const ProductDetailView = ({ id }: ProductDetailViewProps) => {
	const router = useRouter()
	const [isSaved, setIsSaved] = useState(false)

	const { data, isLoading } = useQuery({
		queryKey: ['product', id],
		queryFn: () => fetchProduct(id),
	})

	const { data: related = [] } = useQuery({
		queryKey: ['related-products', data?.product.categoryId],
		queryFn: () =>
			fetchProducts({ category: data?.product.categoryId, limit: 8 }),
		enabled: Boolean(data?.product.categoryId),
	})

	const relatedProducts = useMemo(
		() => related.filter((p) => p.id !== id).slice(0, 4),
		[related, id]
	)

	if (isLoading) {
		return <ProductDetailSkeleton />
	}

	if (!data) {
		return (
			<div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
				<p className='text-muted-foreground'>Produto não encontrado.</p>
				<Button
					render={<Link href='/feed/explorar' />}
					variant='outline'
				>
					Voltar a explorar
				</Button>
			</div>
		)
	}

	const { product, images } = data
	const gallery =
		images.length > 0 ? images : [product.image ?? PRODUCT_PLACEHOLDER]

	const handleToggleSave = () => {
		setIsSaved((prev) => !prev)
		// TODO: chamar API para guardar/remover dos guardados
	}

	const handleShare = async () => {
		const url = typeof window !== 'undefined' ? window.location.href : ''

		if (navigator.share) {
			try {
				await navigator.share({ title: product.name, url })
			} catch {
				// utilizador cancelou a partilha, nada a fazer
			}
			return
		}

		await navigator.clipboard.writeText(url)
		// TODO: mostrar toast "Link copiado"
	}

	const handleChat = () => {
		router.push(`/mensagens?product=${product.id}`)
	}

	const whatsappMessage = encodeURIComponent(
		`Olá! Tenho interesse em "${product.name}"`
	)

	return (
		<div className='mx-auto max-w-4xl pb-10 pt-2'>
			<ProductGallery
				images={gallery}
				productName={product.name}
				isSaved={isSaved}
				onToggleSave={handleToggleSave}
				onShare={handleShare}
			/>

			<div className='space-y-5 px-4 pt-5 md:px-0'>
				<ProductHeader name={product.name} isNew={product.isNew} />

				<ProductPrice
					price={product.price}
					discountPrice={product.discountPrice}
					currency={product.currency}
					negotiable={product.negotiable}
					hasDelivery={product.hasDelivery}
				/>

				<ProductStoreCard
					storeSlug={product.storeSlug}
					storeName={product.storeName}
					storeAvatar={product.storeAvatar}
					storeLocation={product.storeLocation}
					storeVerified={product.storeVerified}
					storeRating={product.storeRating}
				/>

				<ProductDescription description={product.description} />

				<ProductActions
					whatsappHref={`https://wa.me/${product.storePhone}?text=${whatsappMessage}`}
					phoneHref={`tel:${product.storePhone}`}
					onChat={handleChat}
				/>

				<RelatedProducts products={relatedProducts} />
			</div>
		</div>
	)
}
