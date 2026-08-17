'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type PendingStoreItemProps = {
	store: Record<string, unknown>
}
export function PendingStoreItem({ store }: PendingStoreItemProps) {
	return (
		<div className='flex items-center justify-between px-5 py-3'>
			<div className='min-w-0'>
				<p className='truncate text-sm font-semibold'>
					{store.name as string}
				</p>
				<p className='truncate text-xs text-muted-foreground'>
					{((store.users as Record<string, unknown>)
						?.email as string) ?? '—'}
				</p>
			</div>
			<Button
				render={
					<Link
						href={`/admin/stores/pending?review=${store.id as string}`}
					>
						Rever
					</Link>
				}
				size='sm'
				variant='outline'
			/>
		</div>
	)
}
