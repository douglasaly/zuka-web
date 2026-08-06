import Link from 'next/link'
import type { ReactNode } from 'react'
import { AppFooter } from '@/components/app-footer'

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
					<nav
						aria-label='Ajuda e documentos'
						className='flex max-w-[min(100%,18rem)] items-center gap-3 overflow-x-auto text-sm whitespace-nowrap sm:max-w-none sm:gap-4'
					>
						<Link
							href='/perguntas-frequentes'
							className='shrink-0 text-muted-foreground transition-colors hover:text-foreground'
						>
							FAQ
						</Link>
						<Link
							href='/privacidade'
							className='shrink-0 text-muted-foreground transition-colors hover:text-foreground'
						>
							Privacidade
						</Link>
						<Link
							href='/termos'
							className='shrink-0 text-muted-foreground transition-colors hover:text-foreground'
						>
							Termos
						</Link>
						<Link
							href='/'
							className='shrink-0 font-medium text-secondary transition-colors hover:text-secondary/80'
						>
							<span className='sm:hidden'>Loja</span>
							<span className='hidden sm:inline'>Voltar à loja</span>
						</Link>
					</nav>
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
