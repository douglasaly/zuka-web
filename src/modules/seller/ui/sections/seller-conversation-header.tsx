'use client'

import { ArrowLeft } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { SellerThreadPeerHeader } from '@/modules/seller/ui/components/messages/seller-messages-headers'

type SellerConversationHeaderProps = {
	peerName: string
	avatarUrl: string | null | undefined
	loading: boolean
}

export function SellerConversationHeader({
	peerName,
	avatarUrl,
	loading,
}: SellerConversationHeaderProps) {
	return (
		<SellerThreadPeerHeader
			leading={
				<span className='lg:hidden'>
					<IconTooltipButton
						label='Voltar às mensagens'
						size='icon'
						className='size-11'
						href='/dashboard/seller/mensagens'
					>
						<ArrowLeft className='size-4' />
					</IconTooltipButton>
				</span>
			}
			name={peerName}
			avatarUrl={avatarUrl}
			loading={loading}
		/>
	)
}
