'use client'
import { Store } from 'lucide-react'

type SellerSettingsHeaderProps = {
	storeName: string
	email: string | null
	storeSlug?: string | null
}
export function SellerSettingsHeader({
	storeName,
	email,
	storeSlug,
}: SellerSettingsHeaderProps) {
	return (
		<div className='flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8'>
			<p className='max-w-md text-sm leading-snug text-muted-foreground'>
				Conta, loja e alertas. Tudo num único lugar.
			</p>

			<div className='flex min-w-0 w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:max-w-md sm:gap-3.5 sm:px-4'>
				<span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/70'>
					<Store
						className='size-4 text-muted-foreground'
						aria-hidden
					/>
				</span>
				<div className='min-w-0 flex-1'>
					<p className='truncate font-heading text-sm font-semibold tracking-tight sm:text-base'>
						{storeName}
					</p>
					<p className='mt-0.5 truncate text-xs text-muted-foreground sm:text-sm'>
						{email}
						{storeSlug ? (
							<span className='text-xs'> · /{storeSlug}</span>
						) : null}
					</p>
				</div>
			</div>
		</div>
	)
}
