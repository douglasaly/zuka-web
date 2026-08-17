'use client'
import Image from 'next/image'
import { STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { cn } from '@/lib/utils'
import type { StoreFormState } from './types'

type StoreHeroPreviewProps = {
	form: StoreFormState
	verified: boolean
	statusLabel: string
	productCount?: number
}
export function StoreHeroPreview({
	form,
	verified,
	statusLabel,
	productCount,
}: StoreHeroPreviewProps) {
	const isActive = form.status === 'ACTIVE'
	return (
		<div className='min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
			<div className='relative h-32 w-full bg-muted sm:h-44'>
				{form.bannerUrl ? (
					<Image
						src={form.bannerUrl}
						alt='Banner da loja'
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, 900px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
					/>
				) : (
					<div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
						Sem banner
					</div>
				)}
			</div>

			<div className='relative px-4 pb-5 sm:px-6'>
				<div className='-mt-10 flex items-start gap-3 sm:-mt-12 sm:gap-4'>
					<div className='relative size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-sm sm:size-24'>
						<Image
							src={form.logoUrl || STORE_PLACEHOLDER}
							alt={form.name || 'Logo'}
							fill
							className='object-cover'
							sizes='96px'
						/>
					</div>
					<div className='min-w-0 flex-1 pt-11 sm:pt-14'>
						<div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
							<h2 className='max-w-full truncate font-heading text-lg font-bold tracking-tight sm:text-2xl'>
								{form.name.trim() || 'Nome da loja'}
							</h2>
							{verified ? (
								<span className='rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700'>
									Verificada
								</span>
							) : null}
							<span
								className={cn(
									'rounded-full px-2 py-0.5 text-[11px] font-medium',
									isActive
										? 'bg-emerald-500/10 text-emerald-700'
										: 'bg-muted text-muted-foreground'
								)}
							>
								{statusLabel}
							</span>
						</div>
						<p className='mt-0.5 truncate font-mono text-xs text-muted-foreground'>
							/{form.slug || 'slug'}
							{typeof productCount === 'number' ? (
								<span className='font-sans text-muted-foreground'>
									{' '}
									· {productCount} produto
									{productCount === 1 ? '' : 's'}
								</span>
							) : null}
						</p>
					</div>
				</div>

				{form.description.trim() ? (
					<p className='mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground'>
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
