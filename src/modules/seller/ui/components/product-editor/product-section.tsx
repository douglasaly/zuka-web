import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ProductSectionProps = {
	title: string
	description?: string
	action?: ReactNode
	children: ReactNode
	className?: string
}
export function ProductSection({
	title,
	description,
	action,
	children,
	className,
}: ProductSectionProps) {
	return (
		<section
			className={cn(
				'min-w-0 max-w-full rounded-2xl border border-border/60 bg-card p-4 sm:p-6',
				className
			)}
		>
			<div className='mb-5 flex min-w-0 items-start justify-between gap-4'>
				<div className='min-w-0'>
					<h2 className='font-heading text-base font-semibold tracking-tight'>
						{title}
					</h2>
					{description ? (
						<p className='mt-1 text-sm text-muted-foreground'>
							{description}
						</p>
					) : null}
				</div>
				{action}
			</div>
			<div className='min-w-0'>{children}</div>
		</section>
	)
}
