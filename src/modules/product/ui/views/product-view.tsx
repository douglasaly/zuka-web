'use client'

import { ArrowLeft, Heart, Share2, Van } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import { formatPrice } from '@/utils/format-price'

const images = [
	'/product-placeholder.jpg',
	'/product-placeholder.jpg',
	'/product-placeholder.jpg',
	'/product-placeholder.jpg',
	'/placeholder.jpg',
]

export const ProductView = () => {
	const router = useRouter()
	const [api, setApi] = useState<CarouselApi | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const isNew = true

	const onSelect = (index: number) => {
		setActiveIndex(index)
		api?.scrollTo(index)
	}

	const onInit = (api: CarouselApi) => {
		setApi(api)

		api?.on('select', () => {
			setActiveIndex(api.selectedScrollSnap())
		})
	}

	return (
		<div className='max-w-600 mx-auto px-4 flex flex-col gap-y-6 overflow-hidden'>
			<div className='flex w-full flex-col'>
				<div className='flex w-full flex-col space-y-2 mx-auto'>
					{/* CAROUSEL */}
					<div className='relative w-full'>
						<Carousel setApi={onInit} className='w-full'>
							<CarouselContent>
								{images.map((img, index) => (
									<CarouselItem key={index}>
										<div className='relative w-full h-112 overflow-hidden bg-gray-50'>
											<Image
												src={img}
												alt={`product-${index}`}
												fill
												sizes='100vw'
												className='object-cover'
												priority={index === 0}
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>

						{/* BACK BUTTON */}
						<div className='absolute left-5 top-5 z-10'>
							<Button
								size='icon'
								variant='ghost'
								className='rounded-full border bg-white p-2 shadow-sm'
								onClick={() => router.back()}
							>
								<ArrowLeft className='size-5' />
							</Button>
						</div>

						{/* ACTION BUTTONS */}
						<div className='absolute right-5 top-5 z-10 flex gap-3'>
							<Button
								size='icon'
								variant='ghost'
								className='rounded-full border bg-white p-2 shadow-sm'
							>
								<Heart className='size-5' />
							</Button>

							<Button
								size='icon'
								variant='ghost'
								className='rounded-full border bg-white p-2 shadow-sm'
							>
								<Share2 className='size-5' />
							</Button>
						</div>
					</div>

					{/* THUMBNAILS*/}
					<div className='mt-4 flex gap-3 overflow-x-auto px-2'>
						{images.map((img, index) => (
							<Button
								key={index}
								onClick={() => onSelect(index)}
								className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition
              ${
					activeIndex === index
						? 'border-black border-2'
						: 'border-gray-200 opacity-70 hover:opacity-100'
				}`}
							>
								<Image
									src={img}
									alt={`thumb-${index}`}
									fill
									className='object-cover'
								/>
							</Button>
						))}
					</div>
				</div>
				<div className='flex w-full flex-col pt-5 px-2'>
					<div className='flex w-full gap-4 space-y-2 justify-between items-center'>
						<h1 className='font-semibold text-xl'>
							Hearphones Samsung 2026
						</h1>
						{isNew && (
							<Badge
								className='p-4 border-[0.5px] border-gray-200 text-muted-foreground'
								variant='secondary'
							>
								Novo
							</Badge>
						)}
					</div>

					<div className='w-full flex gap-4 items-baseline '>
						<h2 className='font-bold text-2xl'>
							{formatPrice(120000)}
						</h2>
						<span className='text-muted-foreground text-sm font-extralight'>
							Negociável
						</span>
					</div>
					<div className='flex items-center pt-2 text-green-600 text-sm font-light'>
						<Van className='size-5 mr-2' /> Entrega disponível
					</div>
				</div>
			</div>
		</div>
	)
}
