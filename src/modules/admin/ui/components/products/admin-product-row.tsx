'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Eye, Image as ImageIcon, Pause, Play, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TableCell, TableRow } from '@/components/ui/table'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import {
	type AdminProduct,
	PRODUCT_STATUS_LABELS,
} from '@/modules/admin/ui/components/products/constants'
import { IconAction } from '@/modules/admin/ui/components/products/icon-action'
import {
	getThumb,
	productStatus,
} from '@/modules/admin/ui/components/products/utils'
import { StatusBadge } from '@/modules/admin/ui/components/status-badge'
import { formatPrice } from '@/utils/format-price'

type AdminProductRowProps = {
	product: AdminProduct
	isSelected: boolean
	onToggleSelect: (id: string) => void
	onPreview: (product: AdminProduct) => void
	onPause: (id: string) => void
	onReactivate: (id: string) => void
	onDelete: (id: string) => void
}

export function AdminProductRow({
	product,
	isSelected,
	onToggleSelect,
	onPreview,
	onPause,
	onReactivate,
	onDelete,
}: AdminProductRowProps) {
	const id = product.id as string
	const thumb = getThumb(product)
	const store = product.stores as Record<string, unknown> | null
	const cat = product.categories as Record<string, unknown> | null
	const statusKey = productStatus(product)
	const visible = Boolean(product.is_visible)

	return (
		<TableRow
			data-state={isSelected ? 'selected' : undefined}
			className='group'
		>
			<TableCell>
				<input
					type='checkbox'
					className='size-4 accent-primary'
					checked={isSelected}
					onChange={() => onToggleSelect(id)}
					aria-label={`Seleccionar ${product.name as string}`}
				/>
			</TableCell>
			<TableCell>
				<button
					type='button'
					onClick={() => onPreview(product)}
					className='flex max-w-xs items-center gap-3 text-left'
				>
					{thumb ? (
						<div className='relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/60'>
							<Image
								src={thumb}
								alt=''
								fill
								sizes='40px'
								placeholder='blur'
								blurDataURL={BLUR_PLACEHOLDER}
								className='object-cover'
							/>
						</div>
					) : (
						<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
							<ImageIcon className='size-4 text-muted-foreground' />
						</div>
					)}
					<span className='line-clamp-2 text-sm font-medium group-hover:underline'>
						{product.name as string}
					</span>
				</button>
			</TableCell>
			<TableCell className='hidden md:table-cell'>
				{store ? (
					<Link
						href={`/admin/stores/${store.id as string}`}
						className='text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline'
					>
						{store.name as string}
					</Link>
				) : (
					<span className='text-muted-foreground'>—</span>
				)}
			</TableCell>
			<TableCell className='hidden text-sm text-muted-foreground lg:table-cell'>
				{(cat?.name as string) ?? '—'}
			</TableCell>
			<TableCell className='whitespace-nowrap text-sm font-medium tabular-nums'>
				{product.price != null
					? formatPrice(
							Number(product.price),
							(product.currency as string) ?? 'MZN'
						)
					: '—'}
			</TableCell>
			<TableCell>
				<StatusBadge
					status={statusKey}
					label={PRODUCT_STATUS_LABELS[statusKey]}
				/>
			</TableCell>
			<TableCell className='hidden whitespace-nowrap text-xs text-muted-foreground xl:table-cell'>
				{product.created_at
					? format(
							new Date(product.created_at as string),
							'd MMM yyyy',
							{
								locale: pt,
							}
						)
					: '—'}
			</TableCell>
			<TableCell>
				<div className='flex items-center justify-end gap-0.5'>
					<IconAction
						label='Ver detalhes'
						onClick={() => onPreview(product)}
					>
						<Eye className='size-3.5' />
					</IconAction>
					{visible ? (
						<IconAction
							label='Pausar'
							className='text-amber-600 hover:bg-amber-500/10 hover:text-amber-700'
							onClick={() => onPause(id)}
						>
							<Pause className='size-3.5' />
						</IconAction>
					) : (
						<IconAction
							label='Reactivar'
							className='text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700'
							onClick={() => onReactivate(id)}
						>
							<Play className='size-3.5' />
						</IconAction>
					)}
					<IconAction
						label='Eliminar'
						destructive
						onClick={() => onDelete(id)}
					>
						<Trash2 className='size-3.5' />
					</IconAction>
				</div>
			</TableCell>
		</TableRow>
	)
}
