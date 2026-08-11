'use client'

import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
	ExternalLink,
	Image as ImageIcon,
	Pause,
	Play,
	Trash2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import {
	type AdminProduct,
	PRODUCT_STATUS_LABELS,
} from '@/modules/admin/ui/components/products/constants'
import { productStatus } from '@/modules/admin/ui/components/products/utils'
import { StatusBadge } from '@/modules/admin/ui/components/status-badge'
import { formatPrice } from '@/utils/format-price'

type AdminProductPreviewSheetProps = {
	preview: AdminProduct | null
	onOpenChange: (open: boolean) => void
	onPause: (id: string) => void
	onReactivate: (id: string) => void
	onDelete: (id: string) => void
}

export function AdminProductPreviewSheet({
	preview,
	onOpenChange,
	onPause,
	onReactivate,
	onDelete,
}: AdminProductPreviewSheetProps) {
	return (
		<Sheet open={Boolean(preview)} onOpenChange={onOpenChange}>
			<SheetContent
				side='right'
				className='flex w-full flex-col sm:max-w-md'
			>
				{preview ? (
					<>
						<SheetHeader className='border-b border-border/60 pb-4'>
							<SheetTitle className='font-heading pr-8 text-left'>
								{preview.name as string}
							</SheetTitle>
							<SheetDescription className='text-left'>
								{(
									preview.categories as Record<
										string,
										unknown
									> | null
								)?.name
									? String(
											(
												preview.categories as Record<
													string,
													unknown
												>
											).name
										)
									: 'Sem categoria'}
							</SheetDescription>
						</SheetHeader>

						<div className='flex-1 space-y-5 overflow-y-auto py-4'>
							<div className='flex gap-2 overflow-x-auto pb-1'>
								{(
									(preview.product_images ?? []) as Array<{
										url?: string
									}>
								).length > 0 ? (
									(
										(preview.product_images ??
											[]) as Array<{
											url?: string
										}>
									).map((img, i) =>
										img.url ? (
											<div
												key={`${img.url}-${i}`}
												className='relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-border/60'
											>
												<Image
													src={img.url}
													alt=''
													fill
													sizes='160px'
													placeholder='blur'
													blurDataURL={
														BLUR_PLACEHOLDER
													}
													className='object-cover'
												/>
											</div>
										) : null
									)
								) : (
									<div className='flex h-40 w-full items-center justify-center rounded-xl bg-muted'>
										<ImageIcon className='size-8 text-muted-foreground' />
									</div>
								)}
							</div>

							<div className='flex flex-wrap items-center justify-between gap-2'>
								<p className='text-2xl font-bold tabular-nums tracking-tight'>
									{preview.price != null
										? formatPrice(
												Number(preview.price),
												(preview.currency as string) ??
													'MZN'
											)
										: '—'}
								</p>
								<StatusBadge
									status={productStatus(preview)}
									label={
										PRODUCT_STATUS_LABELS[
											productStatus(preview)
										]
									}
								/>
							</div>

							{preview.description ? (
								<p className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
									{String(preview.description)}
								</p>
							) : (
								<p className='text-sm italic text-muted-foreground'>
									Sem descrição.
								</p>
							)}

							{(preview.stores as Record<string, unknown> | null)
								?.name ? (
								<Link
									href={`/admin/stores/${
										(
											preview.stores as Record<
												string,
												unknown
											>
										).id as string
									}`}
									className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
								>
									{
										(
											preview.stores as Record<
												string,
												unknown
											>
										).name as string
									}
									<ExternalLink className='size-3.5' />
								</Link>
							) : null}

							{preview.created_at ? (
								<p className='text-xs text-muted-foreground'>
									Criado em{' '}
									{format(
										new Date(preview.created_at as string),
										"d 'de' MMMM yyyy",
										{ locale: pt }
									)}
								</p>
							) : null}
						</div>

						<SheetFooter className='border-t border-border/60 pt-4 sm:flex-row'>
							{preview.is_visible ? (
								<Button
									type='button'
									variant='outline'
									className='flex-1'
									onClick={() =>
										onPause(preview.id as string)
									}
								>
									<Pause className='size-3.5' />
									Pausar
								</Button>
							) : (
								<Button
									type='button'
									variant='outline'
									className='flex-1'
									onClick={() =>
										onReactivate(preview.id as string)
									}
								>
									<Play className='size-3.5' />
									Reactivar
								</Button>
							)}
							<Button
								type='button'
								variant='destructive'
								className='flex-1'
								onClick={() => onDelete(preview.id as string)}
							>
								<Trash2 className='size-3.5' />
								Eliminar
							</Button>
						</SheetFooter>
					</>
				) : null}
			</SheetContent>
		</Sheet>
	)
}
