'use client'
import { cn } from '@/lib/utils'
import { RANGE_OPTIONS } from '@/modules/seller/ui/components/analytics/constants'
import type { AnalyticsRange } from '@/modules/seller/ui/components/analytics/mock-data'

type SellerAnalyticsHeaderProps = {
	range: AnalyticsRange
	onRangeChange: (range: AnalyticsRange) => void
}
export function SellerAnalyticsHeader({
	range,
	onRangeChange,
}: SellerAnalyticsHeaderProps) {
	return (
		<>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div className='min-w-0'>
					<p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
						Como a loja correu no período escolhido — vendas,
						pedidos, vistas e interesse.
					</p>
				</div>

				<div
					className='flex gap-1.5 self-start rounded-full border border-border/60 bg-card p-1'
					role='group'
					aria-label='Período'
				>
					{RANGE_OPTIONS.map((opt) => (
						<button
							type='button'
							key={opt.value}
							aria-pressed={range === opt.value}
							onClick={() => onRangeChange(opt.value)}
							className={cn(
								'h-10 shrink-0 rounded-full px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
								range === opt.value
									? 'bg-foreground text-background'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							)}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>

			<p
				className='rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground'
				role='status'
			>
				Dados de exemplo para pré-visualizar o ecrã. As métricas reais
				ligam-se quando o rastreio de vistas estiver activo.
			</p>
		</>
	)
}
