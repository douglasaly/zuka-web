import { Skeleton } from '@/components/ui/skeleton'

export function TableSkeleton({
	rows = 6,
	cols = 5,
}: {
	rows?: number
	cols?: number
}) {
	return (
		<div className='space-y-2'>
			{Array.from({ length: rows }, (_, i) => (
				<div
					key={i}
					className='flex items-center gap-4 rounded-xl border border-border/40 px-4 py-3'
				>
					{Array.from({ length: cols }, (_, j) => (
						<Skeleton
							key={j}
							className='h-4 flex-1'
							style={{ maxWidth: `${80 + ((j * 17) % 40)}px` }}
						/>
					))}
				</div>
			))}
		</div>
	)
}
