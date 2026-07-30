import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusStyles = {
	pending:
		'border-transparent bg-amber-500/10 text-amber-800 dark:text-amber-300',
	shipping:
		'border-transparent bg-sky-500/10 text-sky-800 dark:text-sky-300',
	completed:
		'border-transparent bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
	cancelled: 'border-border bg-muted text-muted-foreground',
} as const

interface OrderStatusBadgeProps {
	status: keyof typeof statusStyles | string
	label: string
	className?: string
}

export const OrderStatusBadge = ({
	status,
	label,
	className,
}: OrderStatusBadgeProps) => {
	const key = status.toLowerCase() as keyof typeof statusStyles
	const style = statusStyles[key] ?? statusStyles.pending

	return (
		<Badge
			variant='outline'
			className={cn('font-semibold', style, className)}
		>
			{label}
		</Badge>
	)
}
