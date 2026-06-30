import { BadgeCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'

export type FollowedStore = {
	followedAt: string | null
	id: string
	name: string
	imageUrl: string | null
	slug: string
	verified: boolean
	verifiedAt: string | null
	location: string
}

type FollowedStoreCardProps = {
	store: FollowedStore
}

export const FollowedStoreCard = ({ store }: FollowedStoreCardProps) => {
	return (
		<Link
			href={`/lojas/${store.slug}`}
			className='h-18 w-full rounded-xl bg-white p-4 flex items-center gap-2 border py-8 transition-all duration-200 hover:scale-101 hover:shadow-md'
		>
			<div className='relative shrink-0'>
				<StoreAvatar
					imageUrl={store.imageUrl ?? '/placeholder.jpg'}
					name={store.name}
					size='lg'
				/>

				{store.verified && (
					<span className='absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 text-white text-[9px] flex items-center justify-center'>
						<BadgeCheck className='size-3' />
					</span>
				)}
			</div>

			<div className='flex-1 ml-3 flex flex-col justify-center space-y-1'>
				<h3 className='text-md font-semibold leading-tight'>
					{store.name}
				</h3>

				<div className='text-muted-foreground text-xs leading-tight line-clamp-1'>
					{store.location}
				</div>
			</div>

			<div className='text-muted-foreground text-xs'>
				<ChevronRight className='size-5' />
			</div>
		</Link>
	)
}
