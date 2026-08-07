'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SellerCategoriesToolbar({
	totalCount,
	rootCount,
	subCount,
	onCreate,
}: {
	totalCount: number
	rootCount: number
	subCount: number
	onCreate: () => void
}) {
	return (
		<div className='flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<div className='min-w-0'>
				<p className='text-sm leading-relaxed text-muted-foreground'>
					Organize os produtos em Categorias e Subcategorias.
				</p>
				{totalCount > 0 ? (
					<div className='mt-3 flex flex-wrap gap-2'>
						<span className='inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums'>
							{totalCount} no total
						</span>
						<span className='inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground'>
							{rootCount} categoria
							{rootCount === 1 ? '' : 's'}
						</span>
						{subCount > 0 ? (
							<span className='inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground'>
								{subCount} subcategoria
								{subCount === 1 ? '' : 's'}
							</span>
						) : null}
					</div>
				) : null}
			</div>
			<Button
				className='shrink-0 rounded-full'
				size='default'
				onClick={onCreate}
			>
				<Plus className='size-4' />
				Nova categoria
			</Button>
		</div>
	)
}
