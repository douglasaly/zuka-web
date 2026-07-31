import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
	icon: LucideIcon
	title: string
	description: string
	className?: string
	action?: ReactNode
}

export const EmptyState = ({
	icon: Icon,
	title,
	description,
	className = '',
	action,
}: EmptyStateProps) => (
	<div
		className={cn(
			'flex flex-col items-center justify-center gap-2 rounded-xl border bg-white py-12 text-center',
			className
		)}
	>
		<Icon className='size-8 text-muted-foreground/40' />
		<p className='text-sm font-medium'>{title}</p>
		<p className='max-w-sm text-xs text-muted-foreground'>{description}</p>
		{action ? <div className='mt-3'>{action}</div> : null}
	</div>
)
