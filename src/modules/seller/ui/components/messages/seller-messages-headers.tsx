'use client'

import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'

/** Shared height so inbox rail + thread headers share one baseline. */
const HEADER =
	'flex h-14 shrink-0 items-center border-b border-border/60 bg-card/95 backdrop-blur-sm'

export function SellerInboxRailHeader({
	title = 'Mensagens',
	subtitle,
}: {
	title?: string
	subtitle: string
}) {
	return (
		<div className={cn(HEADER, 'px-4')}>
			<div className='min-w-0'>
				<p className='font-heading text-sm font-semibold tracking-tight'>
					{title}
				</p>
				<p className='truncate text-xs text-muted-foreground'>
					{subtitle}
				</p>
			</div>
		</div>
	)
}

export function SellerThreadPeerHeader({
	leading,
	name,
	avatarUrl,
	subtitle = 'Cliente',
	loading,
}: {
	leading?: ReactNode
	name: string
	avatarUrl?: string | null
	subtitle?: string
	loading?: boolean
}) {
	return (
		<header className={cn(HEADER, 'gap-2 px-3 sm:gap-3 sm:px-4')}>
			{leading}
			{loading ? (
				<div className='flex min-w-0 flex-1 items-center gap-3'>
					<Skeleton className='size-9 rounded-full' />
					<div className='min-w-0 flex-1 space-y-1'>
						<Skeleton className='h-4 w-28' />
						<Skeleton className='h-3 w-16' />
					</div>
				</div>
			) : (
				<>
					<UserAvatar
						name={name}
						imageUrl={avatarUrl}
						size='default'
						fClassName='text-xs font-semibold'
					/>
					<div className='min-w-0 flex-1'>
						<p className='truncate font-heading text-sm font-semibold tracking-tight'>
							{name}
						</p>
						<p className='truncate text-xs text-muted-foreground'>
							{subtitle}
						</p>
					</div>
				</>
			)}
		</header>
	)
}

/** Empty detail pane header — same bar as an open thread. */
export function SellerThreadPlaceholderHeader({
	title = 'Caixa de entrada',
	subtitle = 'Seleccione uma conversa',
}: {
	title?: string
	subtitle?: string
}) {
	return (
		<header className={cn(HEADER, 'gap-3 px-4')}>
			<div className='min-w-0'>
				<p className='truncate font-heading text-sm font-semibold tracking-tight'>
					{title}
				</p>
				<p className='truncate text-xs text-muted-foreground'>
					{subtitle}
				</p>
			</div>
		</header>
	)
}
