'use client'

import { Bell, ExternalLink, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'

function formatSegment(segment: string) {
	return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

export const SellerTopBar = () => {
	const pathname = usePathname()
	const segments = pathname
		.replace('/dashboard/seller', '')
		.split('/')
		.filter(Boolean)

	const breadcrumbs = ['Dashboard', ...segments.map(formatSegment)]

	return (
		<header className='sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 px-6 py-4.5 backdrop-blur-sm'>
			<div className='flex items-center gap-3'>
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

				<div className='hidden md:block'>
					<p className='text-xs text-muted-foreground'>
						{breadcrumbs.join(' / ')}
					</p>
					<p className='font-heading text-lg font-bold leading-tight'>
						{breadcrumbs[breadcrumbs.length - 1]}
					</p>
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<div className='md:hidden text-right mr-2'>
					<p className='text-xs text-muted-foreground'>
						{breadcrumbs.join(' / ')}
					</p>
					<p className='text-sm font-bold leading-tight'>
						{breadcrumbs[breadcrumbs.length - 1]}
					</p>
				</div>

				<Button
					variant='ghost'
					size='icon'
					className='relative'
					render={
						<Link href='/dashboard/seller/mensagens'>
							<Bell className='size-4' />
						</Link>
					}
				/>

				<Link
					href='/feed/explorar'
					className='hidden sm:flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
				>
					<ExternalLink className='size-3' />
					Ver como comprador
				</Link>
			</div>
		</header>
	)
}
