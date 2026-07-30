import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StoreSectionProps = {
	title: string
	description?: string
	action?: ReactNode
	children: ReactNode
	className?: string
}

export function StoreSection({
	title,
	description,
	action,
	children,
	className,
}: StoreSectionProps) {
	return (
		<section
			className={cn(
				'rounded-xl border border-border/60 bg-card p-5 sm:p-6',
				className
			)}
		>
			<div className='mb-5 flex items-start justify-between gap-4'>
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
			{children}
		</section>
	)
}
