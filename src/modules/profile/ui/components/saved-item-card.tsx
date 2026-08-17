'use client'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { StoreAvatar } from '@/components/store-avatar'
import { PRODUCT_PLACEHOLDER, STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { SavedItem } from '@/types/saved-items'
import { formatPrice } from '@/utils/format-price'

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
			className={`group relative w-40 shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:scale-101 hover:shadow-md sm:w-44 ${isRemoving ? 'pointer-events-none scale-95 opacity-0' : ''}`}
		>
			<IconTooltipButton
				label='Remover dos guardados'
				size='icon'
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onRemove(item.id)
				}}
				className='absolute right-2 top-2 z-10 size-7 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white'
			>
				<Heart className='size-4 fill-red-500 text-red-500' />
			</IconTooltipButton>

			<div className='block relative group'>
				<Link
					href={`/product/${item.id}`}
					className='absolute inset-0 z-10'
					aria-label={item.name}
				/>

				<div className='relative aspect-square w-full overflow-hidden bg-muted/40'>
					<Image
						src={item.imageUrl ?? PRODUCT_PLACEHOLDER}
						alt={item.name}
						fill
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
						sizes='(max-width: 640px) 50vw, 33vw'
						className='object-cover transition-transform duration-200 group-hover:scale-105'
					/>
				</div>

				<div className='space-y-0.5 p-3'>
					<h3 className='text-sm font-semibold leading-tight line-clamp-1'>
						{item.name}
					</h3>

					<Link
						href={`/lojas/${item.storeSlug}`}
						className='relative z-20 flex gap-1 items-center hover:underline w-fit'
					>
						<StoreAvatar
							name={item.storeName}
							imageUrl={item.storeImage ?? STORE_PLACEHOLDER}
							size='xs'
							fClassName='text-[8px]'
						/>
						<p className='text-xs text-muted-foreground line-clamp-1'>
							{item.storeName}
						</p>
					</Link>

					<p className='pt-1 text-sm font-bold text-secondary'>
						{formatPrice(item.price)}
					</p>
				</div>
			</div>
		</div>
	)
}
