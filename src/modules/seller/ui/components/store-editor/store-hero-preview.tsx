'use client'

import Image from 'next/image'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { StoreFormState } from './types'

type StoreHeroPreviewProps = {
	form: StoreFormState
	verified: boolean
	statusLabel: string
}

export function StoreHeroPreview({
	form,
	verified,
	statusLabel,
}: StoreHeroPreviewProps) {
	return (
		<div className='overflow-hidden rounded-xl border border-border/60 bg-card'>
			<div className='relative h-36 w-full bg-muted sm:h-44'>
				{form.bannerUrl ? (
					<Image
						src={form.bannerUrl}
						alt='Banner da loja'
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, 800px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
					/>
				) : (
					<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
						Sem banner
					</div>
				)}
			</div>

			<div className='relative px-5 pb-5 pt-0 sm:px-6'>
				<div className='-mt-10 flex items-end gap-4'>
					<div className='relative size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-sm sm:size-24'>
						<Image
							src={form.logoUrl || STORE_PLACEHOLDER}
							alt={form.name || 'Logo'}
							fill
							className='object-cover'
							sizes='96px'
						/>
					</div>
					<div className='min-w-0 pb-1'>
						<div className='flex flex-wrap items-center gap-2'>
							<h1 className='truncate font-heading text-xl font-bold sm:text-2xl'>
								{form.name || 'Nome da loja'}
							</h1>
							{verified ? (
								<span className='rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700'>
									Verificada
								</span>
							) : null}
							<span className='rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'>
								{statusLabel}
							</span>
						</div>
						<p className='mt-0.5 font-mono text-xs text-muted-foreground'>
							/{form.slug || 'slug'}
						</p>
					</div>
				</div>

				{form.description ? (
					<p className='mt-4 line-clamp-3 text-sm text-muted-foreground'>
						{form.description}
					</p>
				) : (
					<p className='mt-4 text-sm italic text-muted-foreground'>
						Adicione uma descrição para apresentar a sua loja.
					</p>
				)}
			</div>
		</div>
	)
}
