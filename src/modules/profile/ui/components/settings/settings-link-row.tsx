import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

type SettingsLinkRowProps = {
	icon?: LucideIcon
	title: string
	description?: string
	href: string
}

export const SettingsLinkRow = ({
	icon: Icon,
	title,
	description,
	href,
}: SettingsLinkRowProps) => (
	<Link
		href={href}
		className='flex w-full items-center gap-3 border-b px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-muted/40'
	>
		{Icon && <Icon className='size-5 shrink-0 text-muted-foreground' />}

		<div className='flex-1 min-w-0'>
			<p className='text-sm font-medium'>{title}</p>
			{description && (
				<p className='text-xs text-muted-foreground'>{description}</p>
			)}
		</div>

		<ChevronRight className='size-4 shrink-0 text-muted-foreground' />
	</Link>
)
