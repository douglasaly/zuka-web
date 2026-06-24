import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
	icon: LucideIcon
	message: string
	cta?: React.ReactNode
	className?: string
}

export function EmptyState({ icon: Icon, message, cta, className }: EmptyStateProps) {
	return (
		<div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center', className)}>
			<div className='flex size-12 items-center justify-center rounded-xl border border-border text-muted-foreground'>
				<Icon className='size-6' />
			</div>
			<p className='text-sm text-muted-foreground'>{message}</p>
			{cta}
		</div>
	)
}
