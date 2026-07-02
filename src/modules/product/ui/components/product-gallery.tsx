'use client'

import { ArrowLeft, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

type ProductGalleryProps = {
	images: string[]
	productName: string
	isSaved: boolean
	onToggleSave: () => void
	onShare: () => void
	isPending?: boolean
}

export const ProductGallery = ({
	images,
	productName,
	isSaved,
	onToggleSave,
	onShare,
	isPending,
}: ProductGalleryProps) => {
	const router = useRouter()
	const [api, setApi] = useState<CarouselApi>()
	const [activeImage, setActiveImage] = useState(0)

	useEffect(() => {
		if (!api) return

		setActiveImage(api.selectedScrollSnap())

		const onSelect = () => setActiveImage(api.selectedScrollSnap())

		api.on('select', onSelect)
		return () => {
			api.off('select', onSelect)
		}
	}, [api])

	return (
		<div>
			<div className='relative max-w-xl aspect-square overflow-hidden bg-muted md:rounded-2xl'>
				<Carousel
					setApi={setApi}
					opts={{ align: 'start' }}
					className='w-full'
				>
					<CarouselContent>
						{images.map((image, index) => (
							<CarouselItem key={index}>
								<div className='relative aspect-square'>
									<Image
										src={image}
										alt={`${productName} - imagem ${index + 1}`}
										fill
										className='object-cover'
										priority={index === 0}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>

				<div className='absolute left-4 right-4 top-4 flex items-center justify-between'>
					<Button
						variant='secondary'
						size='icon-sm'
						type='button'
						aria-label='Voltar'
						onClick={() => router.back()}
						className='group rounded-full border border-border/60 bg-background/90 backdrop-blur-sm'
					>
						<ArrowLeft className='size-4 text-black group-hover:[&svg]:text-white' />
					</Button>
					<div className='flex gap-2'>
						<Button
							variant='secondary'
							size='icon-sm'
							type='button'
							aria-label={
								isSaved
									? 'Remover dos guardados'
									: 'Guardar produto'
							}
							disabled={isPending}
							onClick={onToggleSave}
							className='group rounded-full border border-border/60 bg-background/90 backdrop-blur-sm'
						>
							<Heart
								className={cn(
									'size-4 group-hover:[&svg]:text-white',
									isSaved
										? 'fill-red-500 text-red-500'
										: 'text-black'
								)}
							/>
						</Button>
						<Button
							variant='secondary'
							size='icon-sm'
							type='button'
							aria-label='Partilhar produto'
							onClick={onShare}
							className='group rounded-full border border-border/60 bg-background/90 backdrop-blur-sm'
						>
							<Share2 className='size-4 text-black group-hover:[&svg]:text-white' />
						</Button>
					</div>
				</div>

				{images.length > 1 && (
					<div className='absolute max-w-xl bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5'>
						{images.map((_, i) => (
							<div
								key={i}
								className={cn(
									'h-1.5 rounded-full transition-all',
									i === activeImage
										? 'w-4 bg-white'
										: 'w-1.5 bg-white/50'
								)}
							/>
						))}
					</div>
				)}
			</div>

			{images.length > 1 && (
				<div className='mt-4 flex gap-3 overflow-x-auto px-4 md:px-0'>
					{images.map((img, index) => (
						<Button
							key={index}
							type='button'
							variant='ghost'
							size='icon'
							aria-label={`Ver imagem ${index + 1}`}
							onClick={() => api?.scrollTo(index)}
							className={cn(
								'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border p-0 transition',
								activeImage === index
									? 'border-2 border-black'
									: 'border-gray-200 opacity-70 hover:opacity-100'
							)}
						>
							<Image
								src={img}
								alt={`${productName} ${index + 1}`}
								fill
								className='object-cover'
							/>
						</Button>
					))}
				</div>
			)}
		</div>
	)
}
