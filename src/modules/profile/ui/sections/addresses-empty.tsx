'use client'

import { MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AddressesEmptyProps = {
	onAdd: () => void
}

export function AddressesEmpty({ onAdd }: AddressesEmptyProps) {
	return (
		<div className='flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/60 px-4 py-16 text-center'>
			<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
				<MapPin className='size-7 text-muted-foreground' />
			</div>
			<div>
				<p className='text-lg font-medium'>Nenhum endereço registado</p>
				<p className='mt-1 text-sm text-muted-foreground'>
					Adicione um endereço para facilitar as suas compras
				</p>
			</div>
			<Button onClick={onAdd} variant='outline' className='rounded-full'>
				<Plus className='mr-1.5 size-4' />
				Adicionar endereço
			</Button>
		</div>
	)
}
