import type { Metadata } from 'next'
import Link from 'next/link'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
	title: 'Criar conta',
	description:
		'Crie uma conta Zuka para comprar ou abrir a sua loja em Moçambique.',
	path: '/signup',
})

export default function SignupLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex min-h-screen flex-col bg-background'>
			<header className='shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm'>
				<div className='mx-auto flex max-w-xl items-center justify-between px-4 py-3 sm:px-6'>
					<Link
						href='/'
						className='font-heading text-lg font-bold tracking-tight'
					>
						Zuka
					</Link>
					<div className='flex items-center gap-1.5 text-sm'>
						<span className='hidden text-muted-foreground sm:inline'>
							Já tens conta?
						</span>
						<Link
							href='/auth/login'
							className='font-semibold text-foreground hover:text-secondary'
						>
							Entrar
						</Link>
					</div>
				</div>
			</header>
			{children}
		</div>
	)
}
