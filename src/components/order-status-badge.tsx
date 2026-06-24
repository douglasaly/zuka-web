import { cn } from '@/lib/utils'

const statusStyles = {
	shipping: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
	pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
	completed: 'bg-muted text-muted-foreground border-border',
	cancelled: 'bg-red-50 text-red-600 border-red-200/60',
} as const

interface OrderStatusBadgeProps {
	status: keyof typeof statusStyles
	label: string
	className?: string
}

export const OrderStatusBadge = ({
	status,
	label,
	className,
}: OrderStatusBadgeProps) => {
	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
				statusStyles[status],
				className
			)}
		>
			{label}
		</span>
	)
}
