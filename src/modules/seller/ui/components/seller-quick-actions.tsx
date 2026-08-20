import { ChevronDown, Copy, Package, Plus, Share2, Store } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { absoluteUrl } from '@/lib/seo/site'

type QuickActionsProps = {
	storeSlug?: string | null
	storeName: string
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

const handleShare = async (
	storeSlug: string,
	storeName: string,
	navigatorShare = false
) => {
	const url = absoluteUrl(`/lojas/${storeSlug}`)
	if (navigatorShare && navigator.share) {
		try {
			await navigator.share({
				title: storeName,
				url,
			})
		} catch {}
		return
	}
	await navigator.clipboard.writeText(url)
	toast.success('Link copiado')
}

export const QuickActions = ({ storeSlug, storeName }: QuickActionsProps) => {
	return (
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

			<Link
				href='/dashboard/seller/loja'
				className='inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted'
			>
				<Store className='size-4' />
				Editar loja
			</Link>

			{storeSlug && (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<button
								type='button'
								className='inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted cursor-pointer'
								aria-label='Partilhar loja'
							/>
						}
					>
						<Share2 className='size-4' />
						Partilhar loja
						<ChevronDown className='size-4' />
					</DropdownMenuTrigger>
					<DropdownMenuContent align='start' className='min-w-48'>
						<DropdownMenuItem
							onClick={() =>
								handleShare(storeSlug, storeName, true)
							}
						>
							<Share2 className='size-4' />
							Partilhar loja
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								handleShare(storeSlug, storeName, false)
							}
						>
							<Copy className='size-4' />
							Copiar link da loja
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	)
}
