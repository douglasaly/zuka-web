import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
	label: string
	value: number | string
	pct?: number
	className?: string
}

export function KpiCard({ label, value, pct, className }: KpiCardProps) {
	const up = (pct ?? 0) >= 0

	return (
		<div
			className={cn(
				'rounded-2xl border border-border/60 bg-card p-5',
				className
			)}
		>
			<p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
				{label}
			</p>
			<p className='mt-2 font-heading text-3xl font-bold tabular-nums'>
				{value.toLocaleString('pt-PT')}
			</p>
			{pct !== undefined && (
				<div
					className={cn(
						'mt-2 flex items-center gap-1 text-xs font-medium',
						up ? 'text-emerald-600' : 'text-red-500'
					)}
				>
					{up ? (
						<TrendingUp className='size-3.5' />
					) : (
						<TrendingDown className='size-3.5' />
					)}
					{up ? '+' : ''}
					{pct}% vs últimos 7 dias
				</div>
			)}
		</div>
	)
}
