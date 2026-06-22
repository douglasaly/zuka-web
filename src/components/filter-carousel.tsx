/** biome-ignore-all lint/suspicious/noArrayIndexKey: <export> */
'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
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
		<div className='relative w-full overflow-hidden'>
			{/* Left Fade */}
			<div
				className={cn(
					'absolute left-12 top-0 bottom-0 w-12 z-10 bg-linear-to-r from-white to-transparent pointer-events-none',
					current === 1 && 'hidden'
				)}
			/>

			<Carousel
				setApi={setApi}
				opts={{
					align: 'start',
					dragFree: true,
				}}
				className='w-full px-12'
			>
				<CarouselContent className='-ml-3'>
					{!isLoading && (
						<CarouselItem
							className=' pl-3 basis-auto'
							onClick={() => onSelect?.(null)}
						>
							<Badge
								variant={
									value === undefined
										? 'default'
										: 'secondary'
								}
								className='rounded-2xl p-5 cursor-pointer whitespace-nowrap text-sm'
							>
								Todos
							</Badge>
						</CarouselItem>
					)}

					{isLoading &&
						Array.from({ length: 14 }).map((_, index) => (
							<CarouselItem
								key={index}
								className='pl-3 basis-auto'
							>
								<Skeleton className='rounded-lg px-3 py-1 text-sm h-full w-25 font-semibold'>
									&nbsp;
								</Skeleton>
							</CarouselItem>
						))}

					{!isLoading &&
						data.map((item) => (
							<CarouselItem
								key={item.value}
								className='pl-3 basis-auto'
								onClick={() => onSelect?.(item.value)}
							>
								<Badge
									variant={
										value === item.value
											? 'default'
											: 'secondary'
									}
									className='rounded-2xl p-5 cursor-pointer whitespace-nowrap text-sm'
								>
									{item.label}
								</Badge>
							</CarouselItem>
						))}
				</CarouselContent>
				<CarouselPrevious className='left-0 z-20' />
				<CarouselNext className='right-0 z-20' />
			</Carousel>

			{/* Right Fade */}

			<div
				className={cn(
					'absolute right-12 top-0 bottom-0 w-12 z-10 bg-linear-to-l from-white to-transparent pointer-events-none',
					current === count && 'hidden'
				)}
			/>
		</div>
	)
}
