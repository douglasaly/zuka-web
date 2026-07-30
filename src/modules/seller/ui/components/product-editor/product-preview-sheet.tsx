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
			<SheetContent side='right' className='w-full sm:max-w-[440px]'>
				<SheetHeader>
					<SheetTitle className='font-heading'>
						Pré-visualização
					</SheetTitle>
					<SheetDescription>
						Como o produto pode aparecer para o comprador.
					</SheetDescription>
				</SheetHeader>

				<div className='space-y-5 overflow-y-auto px-1 pb-6'>
					<div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-muted'>
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
							<div className='flex size-full items-center justify-center'>
								<Package className='size-10 text-muted-foreground' />
							</div>
						)}
					</div>

					{form.imageUrls.length > 1 ? (
						<div className='flex gap-2 overflow-x-auto'>
							{form.imageUrls.map((url) => (
								<div
									key={url}
									className='relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted'
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
							<h2 className='font-heading text-xl font-bold'>
								{form.name || 'Nome do produto'}
							</h2>
							<span
								className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${PRODUCT_STATUS_STYLES[form.status] ?? 'bg-muted text-muted-foreground'}`}
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
								<p className='text-2xl font-bold text-primary'>
									{formatPrice(discount, 'MZN')}
								</p>
								<p className='text-sm text-muted-foreground line-through'>
									{formatPrice(price, 'MZN')}
								</p>
							</>
						) : (
							<p className='text-2xl font-bold text-primary'>
								{formatPrice(price, 'MZN')}
							</p>
						)}
					</div>

					{form.description ? (
						<p className='whitespace-pre-wrap text-sm leading-relaxed'>
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
