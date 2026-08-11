'use client'

import { Loader2, MapPin, Trash2 } from 'lucide-react'
import type { Address } from '@/app/api/addresses/types'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Card, CardContent } from '@/components/ui/card'
import { LABEL_ICONS } from './constants'

type AddressCardProps = {
	address: Address
	deleting: boolean
	onSetDefault: (id: string) => void
	onDelete: (id: string) => void
}

export function AddressCard({
	address,
	deleting,
	onSetDefault,
	onDelete,
}: AddressCardProps) {
	const Icon = LABEL_ICONS[address.label] ?? MapPin

	return (
		<Card
			className={`border-border/60 transition-colors ${
				address.isDefault
					? 'border-secondary/30 bg-secondary/[0.03]'
					: ''
			}`}
		>
			<CardContent className='flex items-start gap-4 p-4 md:p-5'>
				<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10'>
					<Icon className='size-5 text-secondary' />
				</div>

				<div className='min-w-0 flex-1'>
					<div className='flex items-center gap-2'>
						<p className='text-sm font-semibold'>{address.label}</p>
						{address.isDefault && (
							<span className='rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-medium text-secondary'>
								Padrão
							</span>
						)}
					</div>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						{address.street}
					</p>
					<p className='text-xs text-muted-foreground'>
						{[
							address.neighborhood,
							address.city,
							address.provinceName,
						]
							.filter(Boolean)
							.join(', ')}
					</p>
				</div>

				<div className='flex shrink-0 items-center gap-1'>
					{!address.isDefault && (
						<IconTooltipButton
							label='Definir como padrão'
							onClick={() => onSetDefault(address.id)}
						>
							<MapPin className='size-4 text-muted-foreground' />
						</IconTooltipButton>
					)}
					<IconTooltipButton
						label='Remover'
						onClick={() => onDelete(address.id)}
						disabled={deleting}
					>
						{deleting ? (
							<Loader2 className='size-4 animate-spin text-destructive' />
						) : (
							<Trash2 className='size-4 text-destructive/70' />
						)}
					</IconTooltipButton>
				</div>
			</CardContent>
		</Card>
	)
}
