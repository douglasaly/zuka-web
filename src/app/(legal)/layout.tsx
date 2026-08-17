import Link from 'next/link'
import type { ReactNode } from 'react'
import { AppFooter } from '@/components/app-footer'
import { LegalHeaderNav } from '@/modules/legal/ui/components/legal-header-nav'
export default function LegalLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col bg-background'>
			<header className='sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm'>
				<div className='mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6'>
					<Link
						href='/'
						className='flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						<span className='flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground'>
							Z
						</span>
						<span className='font-heading text-lg font-bold tracking-tight'>
							Zuka
						</span>
					</Link>
					<LegalHeaderNav />
				</div>
			</header>

			<main
				id='main-content'
				className='mx-auto w-full max-w-7xl flex-1 px-4 md:px-6'
			>
				{children}
			</main>

			<AppFooter />
		</div>
	)
}
