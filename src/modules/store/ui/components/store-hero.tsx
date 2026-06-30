'use client'

import { ArrowLeft, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { cn } from '@/lib/utils'
import type { StoreProfile } from '@/types/marketplace'

type StoreHeroProps = {
	store: StoreProfile
	onBack: () => void
	isSaved: boolean
	onToggleSave: () => void
	onShare: () => void
}

export const StoreHero = ({
	store,
	onBack,
	isSaved,
	onToggleSave,
	onShare,
}: StoreHeroProps) => {
	return (
		<div className='relative h-48 overflow-hidden md:h-56'>
			<Image
				src={store.bannerUrl ?? STORE_PLACEHOLDER}
				alt={store.name}
				fill
				className='object-cover'
				priority
			/>
			<div className='absolute inset-0 bg-black/20' />

			<div className='absolute left-4 right-4 top-4 flex items-center justify-between'>
				<Button
					variant='secondary'
					size='icon-sm'
					type='button'
					aria-label='Voltar'
					onClick={onBack}
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
		</div>
	)
}
