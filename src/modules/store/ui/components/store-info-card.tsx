'use client'

import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { useFollowStore } from '@/hooks/use-follow-store'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import type { StoreProfile } from '@/types/marketplace'
import { StoreVerifiedBadge } from './store-badge'
import { StoreContactActions } from './store-contact-actions'
import { StoreStatsRow } from './store-stats-row'

type StoreInfoCardProps = {
	store: StoreProfile
}

export const StoreInfoCard = ({ store }: StoreInfoCardProps) => {
	const whatsapp = store.whatsapp?.replace(/\D/g, '') ?? ''
	const { isFollowing, toggleFollow, isFollowLoading, isLoading } =
		useFollowStore(store.slug)

	return (
		<div className='relative -mt-16 rounded-2xl border border-border/60 bg-card p-5'>
			<div className='flex gap-4'>
				<div className='relative size-20 shrink-0 overflow-hidden rounded-xl border-2 border-background'>
					<Image
						src={store.logoUrl ?? STORE_PLACEHOLDER}
						alt={store.name}
						fill
						className='object-cover'
					/>
				</div>

				<div className='min-w-0 flex-1 pt-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<h1 className='font-heading text-xl font-bold'>
							{store.name}
						</h1>
						{store.verified && <StoreVerifiedBadge />}
					</div>

					<p className='mt-0.5 flex items-center gap-1 text-sm text-muted-foreground'>
						<MapPin className='size-3.5 shrink-0 text-secondary' />
						{store.location} · {store.neighborhood}
					</p>

					<StoreStatsRow store={store} />
				</div>
			</div>

			<StoreContactActions
				whatsapp={whatsapp || undefined}
				phone={store.phone}
				isFollowing={isFollowing}
				onToggleFollow={toggleFollow}
				isFollowDisabled={isFollowLoading || isLoading}
			/>
		</div>
	)
}
