import { cn } from '@/lib/utils'
import {
	PRODUCT_STATUS_LABELS,
	PRODUCT_STATUS_STYLES,
} from '@/modules/seller/ui/components/product-editor/constants'
export function ProductStatusChip({ status }: { status: string }) {
	const key = status?.toUpperCase?.() ?? ''
	return (
		<span
			className={cn(
				'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
				PRODUCT_STATUS_STYLES[key] ?? 'bg-muted text-muted-foreground'
			)}
		>
			{PRODUCT_STATUS_LABELS[key] ?? status}
		</span>
	)
}
