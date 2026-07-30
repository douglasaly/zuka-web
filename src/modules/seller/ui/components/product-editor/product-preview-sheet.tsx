'use client'

import { Package } from 'lucide-react'
import Image from 'next/image'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/format-price'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_STYLES } from './constants'
import type { ProductFormState } from './types'

type Category = { id: string; name: string }

type ProductPreviewSheetProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	form: ProductFormState
	categories: Category[]
}

export function ProductPreviewSheet({
	open,
	onOpenChange,
	form,
	categories,
}: ProductPreviewSheetProps) {
	const categoryName =
		categories.find((c) => c.id === form.categoryId)?.name ??
		'Sem categoria'
	const price = Number(form.price) || 0
	const discount = form.discountPrice ? Number(form.discountPrice) : null
	const cover = form.imageUrls[0] ?? null

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side='right'
				className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
			>
				<SheetHeader className='border-b border-border/60 px-6 py-4'>
					<SheetTitle className='font-heading text-left'>
						Pré-visualização
					</SheetTitle>
					<SheetDescription className='text-left'>
						Como o comprador pode ver este anúncio.
					</SheetDescription>
				</SheetHeader>

				<div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
					<div className='relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/50'>
						{cover ? (
							<Image
								src={cover}
								alt={form.name || 'Produto'}
								fill
								className='object-cover'
								sizes='440px'
								placeholder='blur'
								blurDataURL={BLUR_PLACEHOLDER}
							/>
						) : (
							<div className='flex size-full flex-col items-center justify-center gap-2 text-muted-foreground'>
								<Package className='size-10' />
								<p className='text-xs'>Sem imagem</p>
							</div>
						)}
					</div>

					{form.imageUrls.length > 1 ? (
						<div className='flex gap-2 overflow-x-auto pb-1'>
							{form.imageUrls.map((url) => (
								<div
									key={url}
									className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border/40'
								>
									<Image
										src={url}
										alt=''
										fill
										className='object-cover'
										sizes='56px'
									/>
								</div>
							))}
						</div>
					) : null}

					<div>
						<div className='flex flex-wrap items-center gap-2'>
							<h2 className='font-heading text-xl font-bold tracking-tight'>
								{form.name.trim() || 'Nome do produto'}
							</h2>
							<span
								className={cn(
									'rounded-full px-2.5 py-0.5 text-[11px] font-medium',
									PRODUCT_STATUS_STYLES[form.status] ??
										'bg-muted text-muted-foreground'
								)}
							>
								{PRODUCT_STATUS_LABELS[form.status] ??
									form.status}
							</span>
						</div>
						<p className='mt-1 text-sm text-muted-foreground'>
							{categoryName}
						</p>
					</div>

					<div className='flex items-baseline gap-2'>
						{discount != null && discount > 0 ? (
							<>
								<p className='text-2xl font-bold tabular-nums tracking-tight text-primary'>
									{formatPrice(discount, 'MZN')}
								</p>
								<p className='text-sm tabular-nums text-muted-foreground line-through'>
									{formatPrice(price, 'MZN')}
								</p>
							</>
						) : price > 0 ? (
							<p className='text-2xl font-bold tabular-nums tracking-tight text-primary'>
								{formatPrice(price, 'MZN')}
							</p>
						) : (
							<p className='text-sm text-muted-foreground'>
								Preço por definir
							</p>
						)}
					</div>

					{form.description.trim() ? (
						<p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
							{form.description}
						</p>
					) : (
						<p className='text-sm italic text-muted-foreground'>
							Sem descrição ainda.
						</p>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
