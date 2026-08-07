'use client'

import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SellerMembersToolbarProps = {
	canManage: boolean
	memberCount: number
	onInvite: () => void
}

export function SellerMembersToolbar({
	canManage,
	memberCount,
	onInvite,
}: SellerMembersToolbarProps) {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<p className='max-w-xl text-sm leading-relaxed text-muted-foreground'>
				{canManage
					? 'Aqui você vê quem pode gerenciar a loja contigo.'
					: 'Aqui você vê a equipe da loja.'}
			</p>
			<div className='flex flex-wrap items-center gap-3'>
				<p className='flex items-center gap-2 text-sm text-muted-foreground tabular-nums'>
					<Users className='size-4 shrink-0' aria-hidden />
					<span>
						{memberCount === 1
							? '1 membro'
							: `${memberCount} membros`}
					</span>
				</p>
				{canManage ? (
					<Button
						className='h-10 rounded-full px-4'
						onClick={onInvite}
					>
						<UserPlus className='size-4' />
						Convidar
					</Button>
				) : null}
			</div>
		</div>
	)
}
