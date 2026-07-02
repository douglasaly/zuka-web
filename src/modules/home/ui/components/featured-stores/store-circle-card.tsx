import { BadgeCheck, CheckCircle2Icon, MapPin } from 'lucide-react'
import Link from 'next/link'
import { StoreAvatar } from '@/components/store-avatar'
import { cn } from '@/lib/utils'
import type { StoreProfile } from '@/types/marketplace'

type StoreCircleCardProps = {
	store: StoreProfile
	highlighted?: boolean
}

export const StoreCircleCard = ({
	store,
	highlighted,
}: StoreCircleCardProps) => {
	const isVerified = store.verified

	return (
		<Link
			href={`/lojas/${store.slug}`}
			prefetch
			className='group flex w-22 shrink-0 flex-col items-center sm:w-24'
		>
			<div
				className={cn(
					'relative rounded-full p-0.5 transition-all duration-300',
					'ring-2 ring-border group-hover:ring-secondary/40',
					highlighted && 'ring-secondary/30'
				)}
			>
				<StoreAvatar
					imageUrl={store.logoUrl ?? '/placeholder.jpg'}
					name={store.name}
					size='xl'
					className='size-16 transition-transform duration-300 group-hover:scale-105 sm:size-18'
				/>

				{isVerified && (
					<div className='absolute -bottom-0.5 -right-0.5 flex size-5 bg-green-500 items-center justify-center rounded-full  ring-white'>
						<BadgeCheck className='size-4  text-white' />
					</div>
				)}
			</div>

			{/* 
			<span className='absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 text-white text-[9px] flex items-center justify-center'>
						<BadgeCheck className='size-3' />
					</span> */}

			<div className='mt-2.5 w-full'>
				<div className='relative overflow-hidden'>
					<p className='store-name animate-marquee-hover whitespace-nowrap text-center text-xs font-semibold text-foreground transition-colors group-hover:text-secondary sm:text-sm'>
						{store.name}
					</p>

					<div className='pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-background to-transparent' />
				</div>

				<p className='mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-muted-foreground sm:text-xs'>
					<MapPin className='size-2.5 shrink-0' />
					<span className='truncate'>
						{store.location} · {store.neighborhood}
					</span>
				</p>
			</div>
		</Link>
	)
}
