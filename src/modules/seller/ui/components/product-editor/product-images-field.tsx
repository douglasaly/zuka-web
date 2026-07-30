'use client'

import { Loader2, Plus, Star, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { uploadImageToR2 } from '@/lib/api/uploads'
import { cn } from '@/lib/utils'
import { MAX_PRODUCT_IMAGES } from './constants'

type ProductImagesFieldProps = {
	urls: string[]
	onChange: (urls: string[]) => void
	disabled?: boolean
}

const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE = 5 * 1024 * 1024

export function ProductImagesField({
	urls,
	onChange,
	disabled,
}: ProductImagesFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [uploading, setUploading] = useState(false)

	async function handleFiles(files: FileList | null) {
		if (!files?.length) return
		const remaining = MAX_PRODUCT_IMAGES - urls.length
		if (remaining <= 0) {
			toast.error(`Máximo de ${MAX_PRODUCT_IMAGES} imagens`)
			return
		}

		const batch = Array.from(files).slice(0, remaining)
		setUploading(true)
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
			setUploading(false)
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

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between gap-2'>
				<div>
					<p className='text-sm font-semibold'>Imagens</p>
					<p className='text-xs text-muted-foreground'>
						Até {MAX_PRODUCT_IMAGES}. A primeira é a capa.
					</p>
				</div>
				<span className='text-xs text-muted-foreground'>
					{urls.length}/{MAX_PRODUCT_IMAGES}
				</span>
			</div>

			<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
				{urls.map((url, index) => (
					<div
						key={`${url}-${index}`}
						className='group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted'
					>
						{/* biome-ignore lint/performance/noImgElement: R2 preview URLs */}
						<img
							src={url}
							alt={`Imagem ${index + 1}`}
							className='size-full object-cover'
						/>
						{index === 0 ? (
							<span className='absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium'>
								Capa
							</span>
						) : null}
						<div className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100'>
							{index > 0 ? (
								<Button
									type='button'
									size='icon-sm'
									variant='secondary'
									className='size-8 rounded-full'
									onClick={() => makePrimary(index)}
									aria-label='Definir como capa'
								>
									<Star className='size-3.5' />
								</Button>
							) : null}
							<Button
								type='button'
								size='icon-sm'
								variant='destructive'
								className='size-8 rounded-full'
								onClick={() => removeAt(index)}
								aria-label='Remover imagem'
							>
								<Trash2 className='size-3.5' />
							</Button>
						</div>
					</div>
				))}

				{urls.length < MAX_PRODUCT_IMAGES ? (
					<button
						type='button'
						disabled={disabled || uploading}
						onClick={() => inputRef.current?.click()}
						className={cn(
							'group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card text-center transition-colors hover:border-foreground/30 hover:bg-muted/30 disabled:opacity-70'
						)}
					>
						{uploading ? (
							<Loader2 className='size-5 animate-spin text-muted-foreground' />
						) : (
							<>
								<div className='flex size-10 items-center justify-center rounded-xl bg-muted'>
									{urls.length === 0 ? (
										<Upload className='size-4 text-muted-foreground' />
									) : (
										<Plus className='size-4 text-muted-foreground' />
									)}
								</div>
								<p className='px-2 text-xs font-medium'>
									{urls.length === 0
										? 'Adicionar fotos'
										: 'Mais fotos'}
								</p>
							</>
						)}
					</button>
				) : null}
			</div>

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
