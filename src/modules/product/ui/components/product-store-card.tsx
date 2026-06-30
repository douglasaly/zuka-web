import { BadgeCheck, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'

type ProductStoreCardProps = {
	storeSlug: string
	storeName: string
	storeAvatar?: string | null
	storeLocation: string
	storeVerified?: boolean
	storeRating?: number | null
}

export const ProductStoreCard = ({
	storeSlug,
	storeName,
	storeAvatar,
	storeLocation,
	storeVerified,
	storeRating,
}: ProductStoreCardProps) => (
	<Link
		href={`/lojas/${storeSlug}`}
		className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30'
	>
		<div className='relative size-12 shrink-0 overflow-hidden rounded-full'>
			<Image
				src={storeAvatar ?? STORE_PLACEHOLDER}
				alt={storeName}
				fill
				className='object-cover'
			/>
		</div>

		<div className='min-w-0 flex-1'>
			<div className='flex items-center gap-1.5'>
				<p className='font-semibold'>{storeName}</p>
				{storeVerified && (
					<BadgeCheck className='size-4 text-emerald-600' />
				)}
			</div>
			<p className='text-sm text-muted-foreground'>{storeLocation}</p>
			{storeRating != null && (
				<p className='flex items-center gap-1 text-xs text-muted-foreground'>
					<Star className='size-3 fill-amber-400 text-amber-400' />
					{storeRating}
				</p>
			)}
		</div>

		<ChevronRight className='size-5 shrink-0 text-muted-foreground' />
	</Link>
)
