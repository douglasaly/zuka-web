'use client'

import { Package, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SellerProductsEmptyProps = {
	hasFilters: boolean
	canCreate: boolean
	onClearFilters: () => void
}

export function SellerProductsEmpty({
	hasFilters,
	canCreate,
	onClearFilters,
}: SellerProductsEmptyProps) {
	return (
		<div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-20 text-center'>
			<div className='flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border/60'>
				<Package className='size-7 text-muted-foreground' />
			</div>
			<h2 className='mt-5 font-heading text-xl font-bold tracking-tight'>
				{hasFilters ? 'Nenhum resultado' : 'A sua vitrine está vazia'}
			</h2>
			<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
				{hasFilters
					? 'Ajuste os filtros ou limpe a pesquisa para ver mais produtos.'
					: 'Publique o primeiro produto para começar a vender no Zuka.'}
			</p>
			{hasFilters ? (
				<Button
					type='button'
					variant='outline'
					className='mt-6 rounded-full'
					onClick={onClearFilters}
				>
					Limpar filtros
				</Button>
			) : canCreate ? (
				<Button
					className='mt-6 rounded-full'
					render={
						<Link href='/dashboard/seller/produtos/novo'>
							<Plus className='size-4' />
							Adicionar produto
						</Link>
					}
				/>
			) : null}
		</div>
	)
}
