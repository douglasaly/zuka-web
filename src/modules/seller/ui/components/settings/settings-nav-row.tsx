'use client'

import { ChevronRight, ExternalLink, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type SettingsNavRowProps = {
	icon: LucideIcon
	title: string
	description: string
	href: string
	external?: boolean
}

export function SettingsNavRow({
	icon: Icon,
	title,
	description,
	href,
	external,
}: SettingsNavRowProps) {
	const className = cn(
		'flex min-w-0 items-center gap-3 px-3.5 py-3.5 transition-colors duration-150 sm:px-4',
		'hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none',
		'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset'
	)

	const content = (
		<>
			<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/70'>
				<Icon className='size-4 text-muted-foreground' aria-hidden />
			</span>
			<span className='min-w-0 flex-1'>
				<span className='block text-sm font-medium'>{title}</span>
				<span className='mt-0.5 block text-xs leading-relaxed wrap-break-word text-muted-foreground'>
					{description}
				</span>
			</span>
			{external ? (
				<ExternalLink
					className='size-3.5 shrink-0 text-muted-foreground'
					aria-hidden
				/>
			) : (
				<ChevronRight
					className='size-4 shrink-0 text-muted-foreground'
					aria-hidden
				/>
			)}
		</>
	)

	if (external) {
		return (
			<a
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				className={className}
			>
				{content}
			</a>
		)
	}

	return (
		<Link href={href} className={className}>
			{content}
		</Link>
	)
}
