import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

type ProfileActionLinkProps = {
	href: string
	icon: LucideIcon
	iconClassName?: string
	title: string
	description: string
}

export const ProfileActionLink = ({
	href,
	icon: Icon,
	iconClassName = '',
	title,
	description,
}: ProfileActionLinkProps) => (
	<Link
		href={href}
		className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:bg-muted/30'
	>
		<Icon className={`size-5 ${iconClassName}`} />
		<div>
			<p className='font-semibold'>{title}</p>
			<p className='text-sm text-muted-foreground'>{description}</p>
		</div>
	</Link>
)
