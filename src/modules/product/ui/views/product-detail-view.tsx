'use client'

import { useQuery } from '@tanstack/react-query'
import {
	ArrowLeft,
	BadgeCheck,
	ChevronRight,
	Heart,
	MessageCircle,
	Phone,
	Share2,
	Star,
	Truck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ExploreProductCard } from '@/components/explore-product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import {
	fetchProduct,
	fetchProducts,
	PRODUCT_PLACEHOLDER,
	STORE_PLACEHOLDER,
} from '@/lib/api/marketplace'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'

interface ProductDetailViewProps {
	id: string
}

export const ProductDetailView = ({ id }: ProductDetailViewProps) => {
	const router = useRouter()
	const [api, setApi] = useState<CarouselApi>()
	const [activeImage, setActiveImage] = useState(0)

	const { data, isLoading } = useQuery({
		queryKey: ['product', id],
		queryFn: () => fetchProduct(id),
	})

	const { data: related = [] } = useQuery({
		queryKey: ['related-products', data?.product.categoryId],
		queryFn: () =>
			fetchProducts({
				category: data?.product.categoryId,
				limit: 8,
			}),
		enabled: Boolean(data?.product.categoryId),
	})

	const relatedProducts = useMemo(
		() => related.filter((p) => p.id !== id).slice(0, 4),
		[related, id]
	)

	useEffect(() => {
		if (!api) return

		setActiveImage(api.selectedScrollSnap())

		const onSelect = () => {
			setActiveImage(api.selectedScrollSnap())
		}

		api.on('select', onSelect)

		return () => {
			api.off('select', onSelect)
		}
	}, [api])

	if (isLoading) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center px-4'>
				<p className='text-muted-foreground'>A carregar produto...</p>
			</div>
		)
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

	function redirectToChat(productId: string) {
		router.push(`/mensagens?product=${productId}`)
	}

	return (
		<div className='mx-auto max-w-3xl pb-10'>
			<div className='relative aspect-square overflow-hidden bg-muted md:rounded-2xl'>
				<Carousel
					setApi={setApi}
					opts={{
						align: 'start',
					}}
					className='w-full'
				>
					<CarouselContent>
						{gallery.map((image, index) => (
							<CarouselItem key={index}>
								<div className='relative aspect-square'>
									<Image
										src={image}
										alt={product.name}
										fill
										className='object-cover'
										priority={index === 0}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				<div className='absolute top-4 left-4 right-4 flex items-center justify-between'>
					<Button
						variant='secondary'
						size='icon-sm'
						type='button'
						onClick={() => router.back()}
						className='rounded-full border border-border/60 bg-background/90 backdrop-blur-sm group'
					>
						<ArrowLeft className='size-4 text-black group-hover:[&svg]:text-white' />
					</Button>
					<div className='flex gap-2'>
						<Button
							variant='secondary'
							size='icon-sm'
							type='button'
							className='rounded-full border border-border/60 bg-background/90 backdrop-blur-sm group'
						>
							<Heart className='size-4 text-black group-hover:[&svg]:text-white' />
						</Button>
						<Button
							variant='secondary'
							size='icon-sm'
							type='button'
							className='rounded-full border border-border/60 bg-background/90 backdrop-blur-sm group'
						>
							<Share2 className='size-4 text-black group-hover:[&svg]:text-white' />
						</Button>
					</div>
				</div>

				{gallery.length >= 1 && (
					<div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5'>
						{gallery.map((_, i) => (
							<div
								key={i}
								className={cn(
									'size-1.5 rounded-full transition-all',
									i === activeImage
										? 'w-4 bg-white'
										: 'bg-white/50'
								)}
							/>
						))}
					</div>
				)}
			</div>

			{gallery.length >= 1 && (
				<div className='mt-4 flex gap-3 overflow-x-auto px-2'>
					{gallery.map((img, index) => (
						<Button
							key={index}
							type='button'
							variant='ghost'
							size='icon'
							onClick={() => api?.scrollTo(index)}
							className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition
				${
					activeImage === index
						? 'border-black border-2'
						: 'border-gray-200 opacity-70 hover:opacity-100'
				}`}
						>
							<Image
								src={img}
								alt={`${product.name} ${index + 1}`}
								fill
								className='object-cover'
							/>
						</Button>
					))}
				</div>
			)}

			<div className='space-y-5 px-4 pt-5 md:px-0'>
				<div className='flex items-start justify-between gap-3'>
					<h1 className='font-heading text-xl font-bold leading-tight md:text-2xl'>
						{product.name}
					</h1>
					{product.isNew && (
						<Badge variant='secondary' className='shrink-0'>
							Novo
						</Badge>
					)}
				</div>

				<div className='flex flex-wrap items-baseline gap-2'>
					<span className='text-2xl font-bold'>
						{formatPrice(
							product.discountPrice ?? product.price,
							product.currency
						)}
					</span>
					{product.discountPrice != null && (
						<span className='text-sm text-muted-foreground line-through'>
							{formatPrice(product.price, product.currency)}
						</span>
					)}
					{product.negotiable && (
						<span className='text-sm text-muted-foreground'>
							Negociável
						</span>
					)}
				</div>

				{product.hasDelivery && (
					<div className='flex items-center gap-2 text-sm font-medium text-emerald-700'>
						<Truck className='size-4' />
						Entrega disponível
					</div>
				)}

				<Link
					href={`/lojas/${product.storeSlug}`}
					className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30'
				>
					<div className='relative size-12 shrink-0 overflow-hidden rounded-full'>
						<Image
							src={product.storeAvatar ?? STORE_PLACEHOLDER}
							alt={product.storeName}
							fill
							className='object-cover'
						/>
					</div>
					<div className='min-w-0 flex-1'>
						<div className='flex items-center gap-1.5'>
							<p className='font-semibold'>{product.storeName}</p>
							{product.storeVerified && (
								<BadgeCheck className='size-4 text-emerald-600' />
							)}
						</div>
						<p className='text-sm text-muted-foreground'>
							{product.storeLocation}
						</p>
						{product.storeRating != null && (
							<p className='flex items-center gap-1 text-xs text-muted-foreground'>
								<Star className='size-3 fill-amber-400 text-amber-400' />
								{product.storeRating}
							</p>
						)}
					</div>
					<ChevronRight className='size-5 shrink-0 text-muted-foreground' />
				</Link>

				<div className='space-y-2'>
					<h2 className='font-heading font-bold'>Descrição</h2>
					<p className='text-sm leading-relaxed text-muted-foreground'>
						{product.description || 'Sem descrição disponível.'}
					</p>
				</div>

				<div className='flex gap-2'>
					<Button
						className='flex-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a]'
						size='lg'
					>
						WhatsApp
					</Button>
					<Button variant='outline' size='lg' className='rounded-xl'>
						<Phone className='size-4' />
						Ligar
					</Button>
					<Button variant='outline' size='lg' className='rounded-xl'>
						<MessageCircle className='size-4' />
						Chat
					</Button>
				</div>

				{relatedProducts.length > 0 && (
					<div className='space-y-4 pt-4'>
						<h2 className='font-heading text-lg font-bold'>
							Produtos relacionados
						</h2>
						<div className='grid grid-cols-2 gap-3'>
							{relatedProducts.map((p) => (
								<ExploreProductCard key={p.id} product={p} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
