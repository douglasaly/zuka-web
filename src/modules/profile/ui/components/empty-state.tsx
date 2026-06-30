import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
	icon: LucideIcon
	title: string
	description: string
	className?: string
}

export const EmptyState = ({
	icon: Icon,
	title,
	description,
	className = '',
}: EmptyStateProps) => (
	<div
		className={`flex flex-col items-center justify-center gap-2 rounded-xl border bg-white py-12 text-center ${className}`}
	>
		<Icon className='size-8 text-muted-foreground/40' />
		<p className='text-sm font-medium'>{title}</p>
		<p className='text-xs text-muted-foreground'>{description}</p>
	</div>
)
