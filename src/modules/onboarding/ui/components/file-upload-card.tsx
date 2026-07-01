'use client'

import { Camera, Loader2, Upload, User, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { uploadImageToR2 } from '@/lib/api/uploads'
import type { UploadPurpose } from '@/types/uploads'
import { cn } from '@/lib/utils'

interface FileUploadCardProps {
	label: string
	hint: string
	accept?: string
	value: string | null
	onChange: (value: string | null, file: File | null) => void
	variant?: 'document' | 'selfie' | 'logo' | 'banner'
	purpose: UploadPurpose
	className?: string
}

const variantConfig = {
	document: {
		icon: Camera,
		emptyTitle: 'BI / Passaporte',
		emptyHint: 'Foto frontal do documento',
	},
	selfie: {
		icon: User,
		emptyTitle: 'Selfie com documento',
		emptyHint: 'Segura o documento ao lado do rosto',
	},
	logo: {
		icon: Upload,
		emptyTitle: 'Carregar logo circular',
		emptyHint: 'Formatos: JPG, PNG · Máx. 5MB',
	},
	banner: {
		icon: Upload,
		emptyTitle: 'Carregar imagem de capa',
		emptyHint: 'Formatos: JPG, PNG · Máx. 5MB',
	},
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function FileUploadCard({
	label,
	hint,
	accept = 'image/jpeg,image/png,image/webp',
	value,
	onChange,
	variant = 'document',
	purpose,
	className,
}: FileUploadCardProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const config = variantConfig[variant]
	const Icon = config.icon
	const isWide = variant === 'banner'

	async function handleFile(file: File | null) {
		setError(null)

		if (!file) {
			onChange(null, null)
			return
		}

		if (!ACCEPTED_TYPES.has(file.type)) {
			setError('Formato inválido. Usa JPG, PNG ou WebP.')
			return
		}

		if (file.size > MAX_FILE_SIZE) {
			setError('O ficheiro deve ter no máximo 5MB.')
			return
		}

		setUploading(true)
		try {
			const publicUrl = await uploadImageToR2(file, purpose)
			onChange(publicUrl, file)
		} catch (uploadError) {
			setError(
				uploadError instanceof Error
					? uploadError.message
					: 'Falha ao carregar imagem.'
			)
			onChange(null, null)
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className={cn('space-y-2', className)}>
			{label && <p className='text-sm font-semibold'>{label}</p>}

			<button
				type='button'
				disabled={uploading}
				onClick={() => inputRef.current?.click()}
				className={cn(
					'group relative w-full overflow-hidden rounded-2xl border border-dashed border-border bg-card text-left transition-colors hover:border-foreground/30 hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-70',
					isWide ? 'min-h-[120px]' : 'min-h-[180px]'
				)}
			>
				{value ? (
					<div className='relative h-full min-h-[inherit] w-full'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={value}
							alt={label || config.emptyTitle}
							className={cn(
								'h-full min-h-[inherit] w-full',
								variant === 'logo'
									? 'object-contain p-4'
									: 'object-cover'
							)}
						/>
						<div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20' />
					</div>
				) : (
					<div
						className={cn(
							'flex h-full min-h-[inherit] flex-col items-center justify-center gap-3 p-4 text-center',
							isWide &&
								'sm:flex-row sm:justify-start sm:px-6 sm:text-left'
						)}
					>
						<div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted'>
							{uploading ? (
								<Loader2 className='size-5 animate-spin text-muted-foreground' />
							) : (
								<Icon className='size-5 text-muted-foreground' />
							)}
						</div>
						<div className='space-y-1'>
							<p className='text-sm font-semibold'>
								{uploading
									? 'A carregar...'
									: hint || config.emptyTitle}
							</p>
							<p className='text-xs text-muted-foreground'>
								{config.emptyHint}
							</p>
							{variant === 'document' || variant === 'selfie' ? (
								<p className='text-xs text-muted-foreground'>
									JPG, PNG, WebP
								</p>
							) : null}
						</div>
					</div>
				)}

				<input
					ref={inputRef}
					type='file'
					accept={accept}
					className='hidden'
					disabled={uploading}
					onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
				/>
			</button>

			{error && <p className='text-xs text-destructive'>{error}</p>}

			{value && !uploading && (
				<button
					type='button'
					onClick={(e) => {
						e.stopPropagation()
						onChange(null, null)
						setError(null)
						if (inputRef.current) inputRef.current.value = ''
					}}
					className='inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground'
				>
					<X className='size-3' />
					Remover imagem
				</button>
			)}
		</div>
	)
}
