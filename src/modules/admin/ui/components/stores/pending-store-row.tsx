'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { StoreRow } from '@/modules/admin/hooks/use-pending-stores'

type PendingStoreRowProps = {
	store: StoreRow
	onReview: (id: string) => void
}

export function PendingStoreRow({ store, onReview }: PendingStoreRowProps) {
	const owner = store.users as Record<string, unknown>
	const category = store.categories as Record<string, unknown>
	const province = store.provinces as Record<string, unknown>

	return (
		<TableRow>
			<TableCell className='font-medium'>
				{store.name as string}
			</TableCell>
			<TableCell>
				<div>
					<p className='text-xs font-medium'>
						{`${owner?.first_name ?? ''} ${owner?.last_name ?? ''}`.trim() ||
							'—'}
					</p>
					<p className='text-xs text-muted-foreground'>
						{(owner?.email as string) ?? '—'}
					</p>
				</div>
			</TableCell>
			<TableCell className='text-muted-foreground'>
				{(category?.name as string) ?? '—'}
			</TableCell>
			<TableCell className='text-muted-foreground'>
				{(province?.name as string) ?? '—'}
			</TableCell>
			<TableCell className='text-muted-foreground text-xs'>
				{store.created_at
					? format(
							new Date(store.created_at as string),
							'd MMM yyyy',
							{
								locale: pt,
							}
						)
					: '—'}
			</TableCell>
			<TableCell>
				<Button
					size='sm'
					variant='outline'
					type='button'
					onClick={() => onReview(store.id as string)}
				>
					Rever
				</Button>
			</TableCell>
		</TableRow>
	)
}
