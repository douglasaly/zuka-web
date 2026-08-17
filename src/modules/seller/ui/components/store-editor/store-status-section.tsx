'use client'
import { Check, Circle } from 'lucide-react'
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
				<div className='rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm'>
					<p className='font-medium text-amber-800 dark:text-amber-200'>
						{LOCKED_STATUS_LABELS[lockedStatus] ?? lockedStatus}
					</p>
					<p className='mt-1 text-muted-foreground'>
						Não pode alterar o estado enquanto a loja estiver neste
						estado. Contacte o suporte se precisar de ajuda.
					</p>
				</div>
			) : (
				<div className='space-y-2'>
					{STATUS_OPTIONS.map((option) => {
						const selected = form.status === option.value
						return (
							<button
								key={option.value}
								type='button'
								aria-pressed={selected}
								onClick={() =>
									onChange({ status: option.value })
								}
								className={cn(
									'flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-150',
									selected
										? 'border-foreground/20 bg-foreground/3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
										: 'border-border/60 hover:border-foreground/15 hover:bg-muted/40'
								)}
							>
								<span
									className={cn(
										'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
										selected
											? 'border-foreground bg-foreground text-background'
											: 'border-border text-transparent'
									)}
								>
									{selected ? (
										<Check
											className='size-3'
											strokeWidth={3}
										/>
									) : (
										<Circle className='size-2.5 opacity-0' />
									)}
								</span>
								<span className='min-w-0 flex-1'>
									<span className='block text-sm font-semibold'>
										{option.label}
									</span>
									<span className='mt-0.5 block text-xs leading-relaxed break-words text-muted-foreground'>
										{option.description}
									</span>
								</span>
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
