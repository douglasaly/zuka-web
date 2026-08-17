'use client'
import { Eye, Package, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { SellerProduct } from '@/lib/types/api/seller'
import { cn } from '@/lib/utils'
import { ProductPriceDisplay } from '@/modules/seller/ui/components/products/product-price-display'
import { ProductStatusChip } from '@/modules/seller/ui/components/products/product-status-chip'

type SellerProductListItemProps = {
	product: SellerProduct
	isSelected: boolean
	canUpdate: boolean
	canDelete: boolean
	onToggle: (id: string) => void
	onPreview: (product: SellerProduct) => void
	onDelete: (id: string) => void
}
export function SellerProductListItem({
	product,
	isSelected,
	canUpdate,
	canDelete,
	onToggle,
	onPreview,
	onDelete,
}: SellerProductListItemProps) {
	const isInactive = product.status?.toUpperCase() !== 'ACTIVE'
	return (
		<li
			className={cn(
				'group flex items-center gap-3 px-3 py-3 transition-colors duration-150 sm:gap-4 sm:px-4',
				isSelected ? 'bg-primary/4' : 'hover:bg-muted/40',
				isInactive && !isSelected && 'opacity-75'
			)}
		>
			<input
				type='checkbox'
				checked={isSelected}
				onChange={() => onToggle(product.id)}
				className='size-4 shrink-0 rounded border-input accent-foreground'
				aria-label={`Seleccionar ${product.name}`}
			/>

			<button
				type='button'
				onClick={() => onPreview(product)}
				className='relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-transform duration-150 group-hover:scale-[1.02] sm:size-16'
			>
				{product.image ? (
					<Image
						src={product.image}
						alt={product.name}
						fill
						className='object-cover'
						sizes='64px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
					/>
				) : (
					<div className='flex size-full items-center justify-center'>
						<Package className='size-5 text-muted-foreground' />
					</div>
				)}
			</button>

			<button
				type='button'
				onClick={() => onPreview(product)}
				className='min-w-0 flex-1 text-left'
			>
				<p className='truncate font-medium leading-snug'>
					{product.name}
				</p>
				<div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
					<ProductPriceDisplay product={product} />
					{product.categoryName ? (
						<span className='truncate text-muted-foreground'>
							· {product.categoryName}
						</span>
					) : null}
				</div>
				<div className='mt-1.5 sm:hidden'>
					<ProductStatusChip status={product.status} />
				</div>
			</button>

			<div className='hidden sm:block'>
				<ProductStatusChip status={product.status} />
			</div>

			<div className='flex shrink-0 items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
				<IconTooltipButton
					label='Pré-visualizar'
					onClick={() => onPreview(product)}
				>
					<Eye className='size-4' />
				</IconTooltipButton>
				{canUpdate ? (
					<IconTooltipButton
						label='Editar'
						href={`/dashboard/seller/produtos/${product.id}/editar`}
					>
						<Pencil className='size-4' />
					</IconTooltipButton>
				) : null}
				{canDelete ? (
					<IconTooltipButton
						label='Eliminar'
						className='text-destructive hover:bg-destructive/10 hover:text-destructive'
						onClick={() => onDelete(product.id)}
					>
						<Trash2 className='size-4' />
					</IconTooltipButton>
				) : null}
			</div>
		</li>
	)
}
