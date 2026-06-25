import { Globe, Mail, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import { Separator } from './ui/separator'

const exploreLinks = [
	{ label: 'Início', href: '/' },
	{ label: 'Produtos', href: '/feed/explorar' },
	{ label: 'Lojas', href: '/feed/explorar?tab=stores' },
]

const resourceLinks = [
	{ label: 'Abrir uma loja', href: '/onboarding' },
	{ label: 'Painel da loja', href: '/dashboard/seller' },
]

const socialLinks = [
	{ icon: Share2, href: '#', label: 'Partilhar' },
	{ icon: Globe, href: '#', label: 'Website' },
	{ icon: MessageCircle, href: '#', label: 'Mensagens' },
	{ icon: Mail, href: 'mailto:ola@zuka.co.mz', label: 'Email' },
]

export const AppFooter = () => {
	return (
		<footer className='mt-auto border-t border-border/60 bg-muted/20'>
			<div className='mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12'>
				<div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4'>
					<div className='space-y-4 sm:col-span-2 lg:col-span-1'>
						<div className='flex items-center gap-2.5'>
							<div className='flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground'>
								Z
							</div>
							<span className='font-heading text-xl font-bold tracking-tight'>
								Zuka
							</span>
						</div>
						<p className='max-w-xs text-sm leading-relaxed text-muted-foreground'>
							Marketplace multivendor moçambicano. Lojas publicam produtos;
							compradores exploram e encomendam com confiança.
						</p>
						<div className='flex gap-2'>
							{socialLinks.map(({ icon: Icon, href, label }) => (
								<Link
									key={label}
									href={href}
									aria-label={label}
									className='flex size-9 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-secondary/30 hover:text-secondary'
								>
									<Icon className='size-4' />
								</Link>
							))}
						</div>
					</div>

					<div>
						<h3 className='mb-3 text-sm font-semibold text-foreground'>
							Explorar
						</h3>
						<ul className='space-y-2.5'>
							{exploreLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className='text-sm text-muted-foreground transition-colors hover:text-secondary'
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='mb-3 text-sm font-semibold text-foreground'>
							Recursos
						</h3>
						<ul className='space-y-2.5'>
							{resourceLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className='text-sm text-muted-foreground transition-colors hover:text-secondary'
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='mb-3 text-sm font-semibold text-foreground'>
							Pagamentos seguros
						</h3>
						<p className='text-sm leading-relaxed text-muted-foreground'>
							M-Pesa, e-Mola, Visa e transferência bancária.
							Compre com confiança.
						</p>
					</div>
				</div>

				<Separator className='my-8' />

				<div className='flex flex-col items-center justify-between gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:text-left'>
					<p>
						© {new Date().getFullYear()}{' '}
						<span className='font-semibold text-foreground'>
							Dotcom TechLabs
						</span>
						. Todos os direitos reservados.
					</p>
					<div className='flex gap-4'>
						<Link href='/privacidade' className='hover:text-secondary'>
							Privacidade
						</Link>
						<Link href='/termos' className='hover:text-secondary'>
							Termos
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
