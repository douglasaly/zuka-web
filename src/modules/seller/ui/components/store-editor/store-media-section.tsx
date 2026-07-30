'use client'

import { Loader2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { uploadImageToR2 } from '@/lib/api/uploads'
import { cn } from '@/lib/utils'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'
import { ImageEditOverlay } from './image-edit-overlay'
import { StoreLogoCropDialog } from './store-logo-crop-dialog'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type StoreMediaSectionProps = {
	form: StoreFormState
	onChange: (patch: Partial<StoreFormState>) => void
	onUploadingChange?: (uploading: boolean) => void
}

const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE = 5 * 1024 * 1024

export function StoreMediaSection({
	form,
	onChange,
	onUploadingChange,
}: StoreMediaSectionProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [cropFile, setCropFile] = useState<File | null>(null)
	const [cropOpen, setCropOpen] = useState(false)
	const [logoUploading, setLogoUploading] = useState(false)
	const [bannerUploading, setBannerUploading] = useState(false)

	const mediaBusy = logoUploading || bannerUploading || cropOpen

	useEffect(() => {
		onUploadingChange?.(mediaBusy)
	}, [mediaBusy, onUploadingChange])

	async function handleRawFile(file: File | null) {
		if (!file) return
		if (!ACCEPTED.has(file.type)) {
			toast.error('Formato inválido. Usa JPG, PNG ou WebP.')
			return
		}
		if (file.size > MAX_SIZE) {
			toast.error('O ficheiro deve ter no máximo 5MB.')
			return
		}
		setCropFile(file)
		setCropOpen(true)
	}

	async function handleCropped(blob: Blob) {
		setCropOpen(false)
		setLogoUploading(true)
		try {
			const file = new File([blob], 'store-logo.jpg', {
				type: 'image/jpeg',
			})
			const publicUrl = await uploadImageToR2(file, 'store-logo')
			onChange({ logoUrl: publicUrl })
			toast.success('Logo actualizado')
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Falha ao carregar o logo'
			)
		} finally {
			setLogoUploading(false)
			setCropFile(null)
			if (inputRef.current) inputRef.current.value = ''
		}
	}

	return (
		<>
			<StoreSection
				title='Imagens'
				description='Logotipo e banner de capa da loja.'
			>
				<div className='grid gap-5 lg:grid-cols-2'>
					<div className='space-y-2'>
						<p className='text-sm font-semibold'>Logo</p>
						<button
							type='button'
							disabled={logoUploading}
							onClick={() => inputRef.current?.click()}
							className={cn(
								'group relative flex min-h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card text-center transition-colors hover:border-foreground/30 hover:bg-muted/30 disabled:opacity-70'
							)}
						>
							{form.logoUrl ? (
								<>
									{/* biome-ignore lint/performance/noImgElement: preview of arbitrary R2 URL before save */}
									<img
										src={form.logoUrl}
										alt='Logo da loja'
										className='h-full min-h-[180px] w-full object-contain p-6'
									/>
									<ImageEditOverlay label='Editar logo' />
								</>
							) : (
								<div className='flex flex-col items-center gap-3 p-4'>
									<div className='flex size-12 items-center justify-center rounded-xl bg-muted'>
										{logoUploading ? (
											<Loader2 className='size-5 animate-spin text-muted-foreground' />
										) : (
											<Upload className='size-5 text-muted-foreground' />
										)}
									</div>
									<div>
										<p className='text-sm font-semibold'>
											{logoUploading
												? 'A carregar...'
												: 'Carregar e recortar logo'}
										</p>
										<p className='text-xs text-muted-foreground'>
											JPG, PNG · Máx. 5MB
										</p>
									</div>
								</div>
							)}
							<input
								ref={inputRef}
								type='file'
								accept='image/jpeg,image/png,image/webp'
								className='hidden'
								disabled={logoUploading}
								onChange={(e) =>
									handleRawFile(e.target.files?.[0] ?? null)
								}
							/>
						</button>
						{form.logoUrl && !logoUploading ? (
							<button
								type='button'
								onClick={() => onChange({ logoUrl: null })}
								className='inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'
							>
								<X className='size-3' />
								Remover logo
							</button>
						) : null}
					</div>

					<FileUploadCard
						label='Banner'
						hint='Carregar imagem de capa'
						variant='banner'
						purpose='store-banner'
						value={form.bannerUrl}
						onChange={(bannerUrl) => onChange({ bannerUrl })}
						onUploadingChange={setBannerUploading}
					/>
				</div>
			</StoreSection>

			<StoreLogoCropDialog
				open={cropOpen}
				file={cropFile}
				onOpenChange={(open) => {
					setCropOpen(open)
					if (!open) {
						setCropFile(null)
						if (inputRef.current) inputRef.current.value = ''
					}
				}}
				onCropped={handleCropped}
			/>
		</>
	)
}
