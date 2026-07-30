'use client'

import { cn } from '@/lib/utils'
import { LOCKED_STATUS_LABELS, STATUS_OPTIONS } from './constants'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type StoreStatusSectionProps = {
	form: StoreFormState
	lockedStatus: string | null
	onChange: (patch: Partial<StoreFormState>) => void
}

export function StoreStatusSection({
	form,
	lockedStatus,
	onChange,
}: StoreStatusSectionProps) {
	const isLocked = Boolean(lockedStatus)

	return (
		<StoreSection
			title='Estado da loja'
			description='Controla a visibilidade no marketplace.'
		>
			{isLocked && lockedStatus ? (
				<div className='rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm'>
					<p className='font-medium text-amber-800 dark:text-amber-200'>
						{LOCKED_STATUS_LABELS[lockedStatus] ?? lockedStatus}
					</p>
					<p className='mt-1 text-muted-foreground'>
						Não pode alterar o estado enquanto a loja estiver neste
						estado. Contacte o suporte se precisar de ajuda.
					</p>
				</div>
			) : (
				<div className='grid gap-3 sm:grid-cols-2'>
					{STATUS_OPTIONS.map((option) => {
						const selected = form.status === option.value
						return (
							<button
								key={option.value}
								type='button'
								onClick={() =>
									onChange({ status: option.value })
								}
								className={cn(
									'rounded-xl border px-4 py-3 text-left transition-colors',
									selected
										? 'border-primary bg-primary/5'
										: 'border-border/60 hover:border-foreground/20 hover:bg-muted/40'
								)}
							>
								<p className='text-sm font-semibold'>
									{option.label}
								</p>
								<p className='mt-1 text-xs text-muted-foreground'>
									{option.description}
								</p>
							</button>
						)
					})}
				</div>
			)}
			<p className='mt-3 text-xs text-muted-foreground'>
				Para fechar a loja permanentemente, pause-a primeiro e contacte
				o suporte se pretender encerrar a conta.
			</p>
		</StoreSection>
	)
}
