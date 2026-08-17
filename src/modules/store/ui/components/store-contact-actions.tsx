'use client'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackContactEvent } from '@/lib/contact-events'

type StoreContactActionsProps = {
	storeId: string
	whatsapp?: string
	phone?: string | null
	isFollowing: boolean
	onToggleFollow: () => void
	isFollowDisabled?: boolean
}
export const StoreContactActions = ({
	storeId,
	whatsapp,
	phone,
	isFollowing,
	onToggleFollow,
	isFollowDisabled,
}: StoreContactActionsProps) => {
	const openWhatsApp = () => {
		if (!whatsapp) return
		trackContactEvent({
			storeId,
			type: 'whatsapp',
			source: 'store',
		})
		window.open(
			`https://wa.me/${whatsapp}`,
			'_blank',
			'noopener,noreferrer'
		)
	}
	const openCall = () => {
		if (!phone) return
		trackContactEvent({
			storeId,
			type: 'call',
			source: 'store',
		})
		window.location.href = `tel:${phone}`
	}
	return (
		<div className='mt-4 flex flex-col gap-2 sm:flex-row'>
			{whatsapp && (
				<Button
					type='button'
					className='flex-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a]'
					onClick={openWhatsApp}
				>
					WhatsApp
				</Button>
			)}

			{phone && (
				<Button
					type='button'
					variant='outline'
					className='flex-1 rounded-xl'
					onClick={openCall}
				>
					<Phone className='size-4' />
					Ligar
				</Button>
			)}
			<Button
				variant={isFollowing ? 'secondary' : 'outline'}
				className='flex-1 rounded-xl sm:px-6'
				onClick={onToggleFollow}
				disabled={isFollowDisabled}
			>
				{isFollowing ? 'Seguindo' : 'Seguir'}
			</Button>
		</div>
	)
}
