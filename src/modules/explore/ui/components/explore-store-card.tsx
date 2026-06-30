import { BadgeCheck, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import type { StoreProfile } from '@/types/marketplace'

type ExploreStoreCardProps = {
	store: StoreProfile
}

export const ExploreStoreCard = ({ store }: ExploreStoreCardProps) => (
	<Link
		href={`/lojas/${store.slug}`}
		className='group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm'
	>
		<div className='relative size-16 shrink-0 overflow-hidden rounded-xl'>
			<Image
				src={store.logoUrl ?? STORE_PLACEHOLDER}
				alt={store.name}
				fill
				sizes='64px'
				className='object-cover transition-transform duration-300 group-hover:scale-105'
			/>
		</div>

		<div className='min-w-0 flex-1'>
			<div className='flex items-center gap-1.5'>
				<p className='truncate font-semibold transition-colors group-hover:text-secondary'>
					{store.name}
				</p>
				{store.verified && (
					<BadgeCheck className='size-4 shrink-0 text-emerald-600' />
				)}
			</div>

			<p className='mt-0.5 truncate text-sm text-muted-foreground'>
				{store.location} · {store.neighborhood}
			</p>

			<div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
				<span className='flex items-center gap-0.5'>
					<Star className='size-3 fill-amber-400 text-amber-400' />
					<span className='font-medium text-foreground'>
						{store.rating}
					</span>
				</span>
				<span>·</span>
				<span>
					{store.productCount} produto
					{store.productCount !== 1 ? 's' : ''}
				</span>
				<span>·</span>
				<span>
					{store.followers.toLocaleString('pt-PT')} seguidores
				</span>
			</div>
		</div>
	</Link>
)
