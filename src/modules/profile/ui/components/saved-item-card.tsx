'use client'

import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { SavedItem } from '@/types/saved-items'

type SavedItemCardProps = {
	item: SavedItem
	onRemove: (id: string) => void
	isRemoving?: boolean
}

export const SavedItemCard = ({
	item,
	onRemove,
	isRemoving = false,
}: SavedItemCardProps) => {
	return (
		<div
			className={`group relative w-40 shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:scale-101 hover:shadow-md sm:w-44 ${
				isRemoving ? 'pointer-events-none scale-95 opacity-0' : ''
			}`}
		>
			<Button
				variant='ghost'
				size='icon'
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onRemove(item.id)
				}}
				aria-label='Remover dos guardados'
				className='absolute right-2 top-2 z-10 size-7 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white'
			>
				<Heart className='size-4 fill-red-500 text-red-500' />
			</Button>

			<Link href={`/product/${item.id}`} className='block'>
				<div className='relative aspect-square w-full overflow-hidden bg-muted/40'>
					<Image
						src={item.imageUrl ?? '/placeholder.jpg'}
						alt={item.name}
						fill
						sizes='(max-width: 640px) 50vw, 33vw'
						className='object-cover transition-transform duration-200 group-hover:scale-105'
					/>
				</div>

				<div className='space-y-0.5 p-3'>
					<h3 className='text-sm font-semibold leading-tight line-clamp-1'>
						{item.name}
					</h3>
					<p className='text-xs text-muted-foreground line-clamp-1'>
						{item.storeName}
					</p>
					<p className='pt-1 text-sm font-bold text-secondary'>
						{item.price}
					</p>
				</div>
			</Link>
		</div>
	)
}
