import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

type SellerEmptyStateProps = {
	icon: LucideIcon
	title: string
	description: string
	cta?: {
		label: string
		href: string
	}
}

export const SellerEmptyState = ({
	icon: Icon,
	title,
	description,
	cta,
}: SellerEmptyStateProps) => (
	<div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-white py-16 text-center'>
		<div className='flex size-12 items-center justify-center rounded-full bg-muted'>
			<Icon className='size-6 text-muted-foreground' />
		</div>

		<div className='space-y-1'>
			<p className='text-sm font-medium'>{title}</p>
			<p className='text-xs text-muted-foreground'>{description}</p>
		</div>

		{cta && (
			<Link
				href={cta.href}
				className='mt-2 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800'
			>
				{cta.label}
			</Link>
		)}
	</div>
)
