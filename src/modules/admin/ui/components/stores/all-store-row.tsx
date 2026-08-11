'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import type { StoreRow } from '@/modules/admin/hooks/use-all-stores'
import { StatusBadge } from '@/modules/admin/ui/components/status-badge'

type AllStoreRowProps = {
	store: StoreRow
	isSelected: boolean
	onToggleSelect: (id: string) => void
	onSuspend: (id: string) => void
	onReactivate: (id: string) => void
	onDelete: (id: string) => void
}

export function AllStoreRow({
	store,
	isSelected,
	onToggleSelect,
	onSuspend,
	onReactivate,
	onDelete,
}: AllStoreRowProps) {
	const owner = store.users as Record<string, unknown>
	const id = store.id as string

	return (
		<TableRow data-state={isSelected ? 'selected' : undefined}>
			<TableCell>
				<input
					type='checkbox'
					className='size-4'
					checked={isSelected}
					onChange={() => onToggleSelect(id)}
				/>
			</TableCell>
			<TableCell>
				<Link
					href={`/admin/stores/${id}`}
					className='font-medium hover:underline'
				>
					{store.name as string}
				</Link>
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
			<TableCell>
				<StatusBadge status={store.status as string} />
			</TableCell>
			<TableCell className='tabular-nums text-sm'>
				{store.productCount as number}
			</TableCell>
			<TableCell className='tabular-nums text-sm'>
				{store.followerCount as number}
			</TableCell>
			<TableCell className='text-xs text-muted-foreground'>
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
				<div className='flex items-center gap-1'>
					<Button
						size='sm'
						variant='ghost'
						render={
							<Link
								href={`/lojas/${store.slug as string}`}
								target='_blank'
							>
								<ExternalLink className='size-3.5' />
							</Link>
						}
					/>
					<Button
						size='sm'
						variant='ghost'
						render={
							<Link href={`/admin/stores/${id}`}>Detalhes</Link>
						}
					/>
					{store.status === 'SUSPENDED' ? (
						<Button
							size='sm'
							variant='ghost'
							type='button'
							className='text-emerald-600'
							onClick={() => onReactivate(id)}
						>
							Reativar
						</Button>
					) : store.status === 'ACTIVE' ? (
						<Button
							size='sm'
							variant='ghost'
							type='button'
							className='text-amber-600'
							onClick={() => onSuspend(id)}
						>
							Suspender
						</Button>
					) : null}
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									size='sm'
									variant='ghost'
									type='button'
									aria-label='Eliminar loja'
									className='text-destructive'
									onClick={() => onDelete(id)}
								>
									<Trash2 className='size-3.5' />
								</Button>
							}
						/>
						<TooltipContent>Eliminar loja</TooltipContent>
					</Tooltip>
				</div>
			</TableCell>
		</TableRow>
	)
}
