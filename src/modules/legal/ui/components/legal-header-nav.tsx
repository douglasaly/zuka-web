'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
	{ href: '/perguntas-frequentes', label: 'FAQ' },
	{ href: '/privacidade', label: 'Privacidade' },
	{ href: '/termos-e-condicoes', label: 'Termos e Condições' },
] as const

export function LegalHeaderNav() {
	const pathname = usePathname()

	return (
		<nav
			aria-label='Ajuda e documentos'
			className='flex max-w-[min(100%,18rem)] items-center gap-3 overflow-x-auto text-sm whitespace-nowrap sm:max-w-none sm:gap-4'
		>
			{navItems.map((item) => {
				const isActive =
					pathname === item.href ||
					pathname.startsWith(`${item.href}/`)

				return (
					<Link
						key={item.href}
						href={item.href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(
							'shrink-0 rounded-md px-1 py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
							isActive
								? 'font-semibold text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{item.label}
					</Link>
				)
			})}
			<Link
				href='/'
				className='shrink-0 rounded-md px-1 py-1 font-medium text-secondary transition-colors outline-none hover:text-secondary/80 focus-visible:ring-2 focus-visible:ring-ring'
			>
				<span className='sm:hidden'>Loja</span>
				<span className='hidden sm:inline'>Voltar à loja</span>
			</Link>
		</nav>
	)
}
