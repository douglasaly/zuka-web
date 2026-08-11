'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

type TopStoreRowProps = {
	store: Record<string, unknown>
}

export function TopStoreRow({ store }: TopStoreRowProps) {
	return (
		<tr className='hover:bg-muted/30 transition-colors'>
			<td className='px-4 py-2.5 font-medium'>{store.name as string}</td>
			<td className='px-4 py-2.5 text-right tabular-nums'>
				{store.products as number}
			</td>
			<td className='px-4 py-2.5 text-right tabular-nums'>
				{store.followers as number}
			</td>
			<td className='px-4 py-2.5 text-xs text-muted-foreground'>
				{store.created_at
					? format(
							new Date(store.created_at as string),
							'd MMM yyyy',
							{
								locale: pt,
							}
						)
					: '—'}
			</td>
		</tr>
	)
}
