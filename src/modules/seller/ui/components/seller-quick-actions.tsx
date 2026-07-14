import Link from 'next/link'
import { ExternalLink, Package, Plus, Store } from 'lucide-react'

type QuickActionsProps = {
	storeSlug?: string
}

const actions = [
	{
		label: 'Novo produto',
		icon: Plus,
		href: '/dashboard/seller/produtos/novo',
		variant: 'primary' as const,
	},
	{
		label: 'Ver pedidos',
		icon: Package,
		href: '/dashboard/seller/pedidos',
		variant: 'secondary' as const,
	},
]

export const QuickActions = ({ storeSlug }: QuickActionsProps) => (
	<div className='flex flex-wrap gap-3'>
		{actions.map((action) => (
			<Link
				key={action.href}
				href={action.href}
				className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
					action.variant === 'primary'
						? 'bg-neutral-900 text-white hover:bg-neutral-800'
						: 'border bg-white text-foreground hover:bg-muted'
				}`}
			>
				<action.icon className='size-4' />
				{action.label}
			</Link>
		))}

		{storeSlug && (
			<a
				href={`/loja/${storeSlug}`}
				target='_blank'
				rel='noopener noreferrer'
				className='inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted'
			>
				<ExternalLink className='size-4' />
				Partilhar loja
			</a>
		)}

		<Link
			href='/dashboard/seller/loja'
			className='inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted'
		>
			<Store className='size-4' />
			Editar loja
		</Link>
	</div>
)
