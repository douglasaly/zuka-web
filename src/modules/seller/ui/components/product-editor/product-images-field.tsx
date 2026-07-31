'use client'

import { Loader2, Plus, Star, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { uploadImageToR2 } from '@/lib/api/uploads'
import { cn } from '@/lib/utils'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { MAX_PRODUCT_IMAGES } from './constants'

type ProductImagesFieldProps = {
	urls: string[]
	onChange: (urls: string[]) => void
	disabled?: boolean
	onUploadingChange?: (uploading: boolean) => void
}

const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE = 5 * 1024 * 1024

export function ProductImagesField({
	urls,
	onChange,
	disabled,
	onUploadingChange,
}: ProductImagesFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [uploading, setUploading] = useState(false)
	const [dragging, setDragging] = useState(false)

	function setBusy(next: boolean) {
		setUploading(next)
		onUploadingChange?.(next)
	}

	async function handleFiles(files: FileList | File[] | null) {
		if (!files?.length) return
		const remaining = MAX_PRODUCT_IMAGES - urls.length
		if (remaining <= 0) {
			toast.error(`Máximo de ${MAX_PRODUCT_IMAGES} imagens`)
			return
		}

		const batch = Array.from(files).slice(0, remaining)
		setBusy(true)
		const next = [...urls]

		try {
			for (const file of batch) {
				if (!ACCEPTED.has(file.type)) {
					toast.error(`${file.name}: formato inválido`)
					continue
				}
				if (file.size > MAX_SIZE) {
					toast.error(`${file.name}: máximo 5MB`)
					continue
				}
				const publicUrl = await uploadImageToR2(file, 'product-image')
				next.push(publicUrl)
			}
			onChange(next)
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Falha ao carregar imagens'
			)
		} finally {
			setBusy(false)
			if (inputRef.current) inputRef.current.value = ''
		}
	}

	function removeAt(index: number) {
		onChange(urls.filter((_, i) => i !== index))
	}

	function makePrimary(index: number) {
		if (index === 0) return
		const next = [...urls]
		const [item] = next.splice(index, 1)
		next.unshift(item)
		onChange(next)
	}

	const canAdd = urls.length < MAX_PRODUCT_IMAGES && !disabled && !uploading

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-2'>
				<p className='text-xs text-muted-foreground'>
					JPEG, PNG ou WebP · máx. 5MB cada
				</p>
				<span className='rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground'>
					{urls.length}/{MAX_PRODUCT_IMAGES}
				</span>
			</div>

			{urls.length === 0 ? (
				<button
					type='button'
					disabled={!canAdd && !uploading}
					onClick={() => inputRef.current?.click()}
					onDragEnter={(e) => {
						e.preventDefault()
						setDragging(true)
					}}
					onDragOver={(e) => {
						e.preventDefault()
						setDragging(true)
					}}
					onDragLeave={() => setDragging(false)}
					onDrop={(e) => {
						e.preventDefault()
						setDragging(false)
						if (canAdd) handleFiles(e.dataTransfer.files)
					}}
					className={cn(
						'flex w-full max-w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-10 text-center transition-colors duration-150 sm:px-6 sm:py-12',
						dragging
							? 'border-foreground/40 bg-muted/50'
							: 'border-border bg-muted/20 hover:border-foreground/25 hover:bg-muted/35',
						(disabled || uploading) && 'opacity-70'
					)}
				>
					{uploading ? (
						<Loader2 className='size-6 animate-spin text-muted-foreground' />
					) : (
						<div className='flex size-12 items-center justify-center rounded-2xl bg-background shadow-sm ring-1 ring-border/60'>
							<Upload className='size-5 text-muted-foreground' />
						</div>
					)}
					<div className='min-w-0 max-w-full'>
						<p className='text-sm font-semibold'>
							{uploading
								? 'A carregar…'
								: 'Arraste fotos ou clique para adicionar'}
						</p>
						<p className='mt-1 text-xs text-muted-foreground'>
							A primeira imagem será a capa do anúncio
						</p>
					</div>
				</button>
			) : (
				<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
					{urls.map((url, index) => (
						<div
							key={`${url}-${index}`}
							className='group relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-border/50'
						>
							<Image
								src={url}
								alt={`Imagem ${index + 1}`}
								fill
								className='object-cover'
								sizes='160px'
								placeholder='blur'
								blurDataURL={BLUR_PLACEHOLDER}
							/>
							{index === 0 ? (
								<span className='absolute left-2 top-2 rounded-full bg-background/95 px-2 py-0.5 text-[10px] font-semibold shadow-sm'>
									Capa
								</span>
							) : null}
							<div className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-linear-to-t from-black/65 to-transparent p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100'>
								{index > 0 ? (
									<IconTooltipButton
										label='Definir como capa'
										size='icon-sm'
										variant='secondary'
										className='size-8'
										onClick={() => makePrimary(index)}
									>
										<Star className='size-3.5' />
									</IconTooltipButton>
								) : null}
								<IconTooltipButton
									label='Remover imagem'
									size='icon-sm'
									variant='destructive'
									className='size-8'
									onClick={() => removeAt(index)}
								>
									<Trash2 className='size-3.5' />
								</IconTooltipButton>
							</div>
						</div>
					))}

					{urls.length < MAX_PRODUCT_IMAGES ? (
						<button
							type='button'
							disabled={!canAdd && !uploading}
							onClick={() => inputRef.current?.click()}
							className='flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 text-center transition-colors hover:border-foreground/25 hover:bg-muted/40 disabled:opacity-70'
						>
							{uploading ? (
								<Loader2 className='size-5 animate-spin text-muted-foreground' />
							) : (
								<>
									<div className='flex size-9 items-center justify-center rounded-xl bg-background ring-1 ring-border/60'>
										<Plus className='size-4 text-muted-foreground' />
									</div>
									<p className='px-2 text-xs font-medium'>
										Mais fotos
									</p>
								</>
							)}
						</button>
					) : null}
				</div>
			)}

			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/png,image/webp'
				multiple
				className='hidden'
				disabled={disabled || uploading}
				onChange={(e) => handleFiles(e.target.files)}
			/>
		</div>
	)
}
