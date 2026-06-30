'use client'

import { Phone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type StoreContactActionsProps = {
	whatsapp?: string
	phone?: string | null
	isFollowing: boolean
	onToggleFollow: () => void
	isFollowDisabled?: boolean
}

export const StoreContactActions = ({
	whatsapp,
	phone,
	isFollowing,
	onToggleFollow,
	isFollowDisabled,
}: StoreContactActionsProps) => (
	<div className='mt-4 flex flex-col gap-2 sm:flex-row'>
		{whatsapp && (
			<Button
				className='flex-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a]'
				render={
					<Link
						href={`https://wa.me/${whatsapp}`}
						target='_blank'
						rel='noopener noreferrer'
					/>
				}
			>
				WhatsApp
			</Button>
		)}

		{phone && (
			<Button
				variant='outline'
				className='flex-1 rounded-xl'
				render={<Link href={`tel:${phone}`} />}
			>
				<Phone className='size-4' />
				Ligar
			</Button>
		)}
		<Button
			variant={isFollowing ? 'secondary' : 'outline'}
			className='rounded-xl sm:px-6'
			onClick={onToggleFollow}
			disabled={isFollowDisabled}
		>
			{isFollowing ? 'Seguindo' : 'Seguir'}
		</Button>
	</div>
)
