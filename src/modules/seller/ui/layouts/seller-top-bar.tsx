'use client'

import { ExternalLink, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { NotificationDropdown } from '@/modules/notifications/ui/components/notification-dropdown'
import { useSellerPageMeta } from './seller-page-meta'

const SEGMENT_LABELS: Record<string, string> = {
	produtos: 'Produtos',
	pedidos: 'Pedidos',
	mensagens: 'Mensagens',
	loja: 'Minha Loja',
	avaliacoes: 'Avaliações',
	analytics: 'Desempenho',
	configuracoes: 'Configurações',
	categorias: 'Categorias',
	membros: 'Membros',
	novo: 'Novo',
	editar: 'Editar',
}

function isUuidLike(segment: string) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
		segment
	)
}

function formatSegment(segment: string) {
	if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]
	if (isUuidLike(segment)) return null
	return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

function buildDefaultCrumbs(pathname: string) {
	const segments = pathname
		.replace('/dashboard/seller', '')
		.split('/')
		.filter(Boolean)

	const labels = segments
		.map(formatSegment)
		.filter((label): label is string => Boolean(label))

	return ['Dashboard', ...labels]
}

export const SellerTopBar = () => {
	const pathname = usePathname()
	const { meta } = useSellerPageMeta()

	const breadcrumbs =
		meta.crumbs && meta.crumbs.length > 0
			? meta.crumbs
			: buildDefaultCrumbs(pathname)

	const title =
		meta.title?.trim() || breadcrumbs[breadcrumbs.length - 1] || 'Dashboard'

	const crumbTrail = breadcrumbs.slice(0, -1)

	return (
		<header className='sticky top-0 z-30 flex h-[76px] min-w-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 px-4 backdrop-blur-sm sm:px-6'>
			<div className='flex min-w-0 items-center gap-2 sm:gap-3'>
				<Tooltip>
					<TooltipTrigger
						render={
							<SidebarTrigger
								nativeButton
								className='md:hidden'
								render={
									<Button
										variant='ghost'
										size='icon-sm'
										aria-label='Menu'
									>
										<Menu className='size-4' />
									</Button>
								}
							/>
						}
					/>
					<TooltipContent side='bottom'>Menu</TooltipContent>
				</Tooltip>

				<div className='hidden min-w-0 md:block'>
					{crumbTrail.length > 0 ? (
						<p className='truncate text-xs text-muted-foreground'>
							{crumbTrail.join(' / ')}
						</p>
					) : null}
					<p className='truncate font-heading text-lg font-bold leading-tight'>
						{title}
					</p>
				</div>
			</div>
			<div className='flex shrink-0 items-center gap-2'>
				<div className='mr-2 min-w-0 text-right md:hidden'>
					{crumbTrail.length > 0 ? (
						<p className='truncate text-xs text-muted-foreground'>
							{crumbTrail.join(' / ')}
						</p>
					) : null}
					<p className='truncate text-sm font-bold leading-tight'>
						{title}
					</p>
				</div>

				<NotificationDropdown />

				<Link
					href='/feed/explorar'
					className='hidden items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex'
				>
					<ExternalLink className='size-3' />
					Ver como comprador
				</Link>
			</div>
		</header>
	)
}
