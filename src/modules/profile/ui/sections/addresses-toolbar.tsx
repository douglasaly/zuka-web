'use client'
import { ArrowLeft, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'

type AddressesToolbarProps = {
	onAdd: () => void
}
export function AddressesToolbar({ onAdd }: AddressesToolbarProps) {
	const router = useRouter()
	return (
		<div className='mb-8 flex items-center justify-between'>
			<div className='flex items-center gap-2'>
				<IconTooltipButton label='Voltar' onClick={() => router.back()}>
					<ArrowLeft className='size-4' />
				</IconTooltipButton>
				<div>
					<h1 className='font-heading text-2xl font-bold md:text-3xl'>
						Endereços
					</h1>
					<p className='text-sm text-muted-foreground'>
						Gerir os seus endereços de entrega
					</p>
				</div>
			</div>
			<Button onClick={onAdd} className='rounded-full'>
				<Plus className='mr-1.5 size-4' />
				Adicionar
			</Button>
		</div>
	)
}
