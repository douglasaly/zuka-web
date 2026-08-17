'use client'
import { Package, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { SellerProduct } from '@/lib/types/api/seller'
import { cn } from '@/lib/utils'
import { ProductStatusChip } from '@/modules/seller/ui/components/products/product-status-chip'
import { formatPrice } from '@/utils/format-price'

type ProductCatalogPreviewPanelProps = {
	preview: SellerProduct
	heroUrl: string | null
	onSelectImage: (url: string) => void
	onDelete: () => void
	canUpdate?: boolean
	canDelete?: boolean
}
export function ProductCatalogPreviewPanel({
	preview,
	heroUrl,
	onSelectImage,
	onDelete,
	canUpdate = true,
	canDelete = true,
}: ProductCatalogPreviewPanelProps) {
	return (
		<>
			<SheetHeader className='border-b border-border/60 px-6 py-4'>
				<SheetTitle className='font-heading pr-8 text-left'>
					{preview.name}
				</SheetTitle>
				<SheetDescription className='text-left'>
					{preview.categoryName ?? 'Sem categoria'}
				</SheetDescription>
			</SheetHeader>

			<div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
				<div className='relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/50'>
					{heroUrl ? (
						<Image
							src={heroUrl}
							alt={preview.name}
							fill
							className='object-cover'
							sizes='440px'
							placeholder='blur'
							blurDataURL={BLUR_PLACEHOLDER}
						/>
					) : (
						<div className='flex size-full items-center justify-center'>
							<Package className='size-10 text-muted-foreground' />
						</div>
					)}
				</div>

				{preview.images?.length > 1 ? (
					<div className='flex gap-2 overflow-x-auto pb-1'>
						{preview.images.map((url) => (
							<button
								key={url}
								type='button'
								onClick={() => onSelectImage(url)}
								className={cn(
									'relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-2 transition-shadow',
									heroUrl === url
										? 'ring-foreground'
										: 'ring-transparent hover:ring-border'
								)}
							>
								<Image
									src={url}
									alt=''
									fill
									className='object-cover'
									sizes='56px'
								/>
							</button>
						))}
					</div>
				) : null}

				<div className='flex flex-wrap items-center justify-between gap-2'>
					<div>
						{preview.discountPrice != null &&
						preview.discountPrice > 0 ? (
							<div className='flex items-baseline gap-2'>
								<p className='text-2xl font-bold tabular-nums tracking-tight text-primary'>
									{formatPrice(
										preview.discountPrice,
										preview.currency
									)}
								</p>
								<p className='text-sm text-muted-foreground line-through'>
									{formatPrice(
										preview.price,
										preview.currency
									)}
								</p>
							</div>
						) : (
							<p className='text-2xl font-bold tabular-nums tracking-tight text-primary'>
								{formatPrice(preview.price, preview.currency)}
							</p>
						)}
					</div>
					<ProductStatusChip status={preview.status} />
				</div>

				{preview.description ? (
					<p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
						{preview.description}
					</p>
				) : (
					<p className='text-sm italic text-muted-foreground'>
						Sem descrição.
					</p>
				)}
			</div>

			{(canUpdate || canDelete) && (
				<SheetFooter className='border-t border-border/60 px-6 py-4 sm:flex-row'>
					{canUpdate ? (
						<Button
							className='flex-1 rounded-full'
							render={
								<Link
									href={`/dashboard/seller/produtos/${preview.id}/editar`}
								>
									<Pencil className='size-4' />
									Editar
								</Link>
							}
						/>
					) : null}
					{canDelete ? (
						<Button
							type='button'
							variant='outline'
							className='flex-1 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive'
							onClick={onDelete}
						>
							<Trash2 className='size-4' />
							Eliminar
						</Button>
					) : null}
				</SheetFooter>
			)}
		</>
	)
}
