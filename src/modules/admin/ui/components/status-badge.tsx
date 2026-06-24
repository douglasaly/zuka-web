import { cn } from '@/lib/utils'

const config: Record<string, { label: string; classes: string }> = {
	ACTIVE: { label: 'Aprovada', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
	PENDING: { label: 'Pendente', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
	REJECTED: { label: 'Rejeitada', classes: 'bg-red-50 text-red-700 border-red-200' },
	SUSPENDED: { label: 'Suspensa', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
	DELETED: { label: 'Eliminada', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
	// User statuses
	admin: { label: 'Admin', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
	super_admin: { label: 'Super admin', classes: 'bg-violet-50 text-violet-800 border-violet-200' },
	seller: { label: 'Vendedor', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
	buyer: { label: 'Comprador', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
	const cfg = config[status] ?? { label: status, classes: 'bg-muted text-muted-foreground border-border' }
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
				cfg.classes,
				className
			)}
		>
			{cfg.label}
		</span>
	)
}
