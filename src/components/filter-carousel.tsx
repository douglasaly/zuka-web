/** biome-ignore-all lint/suspicious/noArrayIndexKey: <export> */
'use client'

import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from './ui/carousel'
import { Skeleton } from './ui/skeleton'

interface FilterCarouselProps {
	value?: string | null
	isLoading?: boolean
	onSelect?: (valu: string | null) => void
	data: {
		value: string
		label: string
	}[]
}

const pillBase =
	'inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 select-none'

const pillInactive =
	'border-border/70 bg-background text-muted-foreground hover:border-secondary/30 hover:bg-secondary/5 hover:text-foreground'

const pillActive =
	'border-primary bg-primary text-primary-foreground hover:bg-primary/90'

export const FilterCarousel = ({
	data,
	isLoading,
	onSelect,
	value,
}: FilterCarouselProps) => {
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [count, setCount] = useState(0)

	useEffect(() => {
		if (!api) {
			return
		}

		setCount(api.scrollSnapList().length)
		setCurrent(api.selectedScrollSnap() + 1)

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1)
		})
	}, [api])

	return (
		<section className='space-y-3'>
			<h2 className='font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
				Categorias
			</h2>

			<div className='relative w-full overflow-hidden'>
				<div
					className={cn(
						'pointer-events-none absolute top-0 bottom-0 left-10 z-10 w-10 bg-gradient-to-r from-background to-transparent',
						current === 1 && 'hidden'
					)}
				/>

				<Carousel
					setApi={setApi}
					opts={{
						align: 'start',
						dragFree: true,
					}}
					plugins={[WheelGesturesPlugin()]}
					className='w-full px-10'
				>
					<CarouselContent className='-ml-2'>
						{!isLoading && (
							<CarouselItem
								className='basis-auto pl-2'
								onClick={() => onSelect?.(null)}
							>
								<span
									className={cn(
										pillBase,
										value === undefined || value === null
											? pillActive
											: pillInactive
									)}
								>
									Todos
								</span>
							</CarouselItem>
						)}

						{isLoading &&
							Array.from({ length: 10 }).map((_, index) => (
								<CarouselItem
									key={index}
									className='basis-auto pl-2'
								>
									<Skeleton className='h-9 w-24 rounded-full' />
								</CarouselItem>
							))}

						{!isLoading &&
							data.map((item) => (
								<CarouselItem
									key={item.value}
									className='basis-auto pl-2'
									onClick={() => onSelect?.(item.value)}
								>
									<span
										className={cn(
											pillBase,
											value === item.value
												? pillActive
												: pillInactive
										)}
									>
										{item.label}
									</span>
								</CarouselItem>
							))}
					</CarouselContent>
					<CarouselPrevious className='left-0 z-20 size-8 border border-border/60 bg-background/90 backdrop-blur-sm' />
					<CarouselNext className='right-0 z-20 size-8 border border-border/60 bg-background/90 backdrop-blur-sm' />
				</Carousel>

				<div
					className={cn(
						'pointer-events-none absolute top-0 right-10 bottom-0 z-10 w-10 bg-gradient-to-l from-background to-transparent',
						current === count && 'hidden'
					)}
				/>
			</div>
		</section>
	)
}
