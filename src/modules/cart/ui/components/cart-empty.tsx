'use client'

import { ArrowRight, Compass, Heart, MessageCircle, Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'

const STEPS = [
	{
		title: 'Explora o que há perto de ti',
		body: 'Produtos e lojas locais, com preço à vista.',
	},
	{
		title: 'Adiciona à loja certa',
		body: 'Cada vendedor tem o seu carrinho. Nada se mistura.',
	},
	{
		title: 'Fala e combina',
		body: 'Envia o resumo por WhatsApp ou chat. Pagamento e entrega combinam-se com a loja.',
	},
] as const

export function CartEmpty() {
	const { isAuthenticated } = useUserProfile()

	return (
		<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
			<div className='order-2 min-w-0 flex-1 space-y-4 lg:order-1'>
				<section className='relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground shadow-[0_16px_40px_-18px_color-mix(in_oklch,#e8340a_70%,transparent)]'>
					<div
						aria-hidden
						className='pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-foreground/10 blur-3xl'
					/>
					<div className='relative px-6 py-8 sm:px-8 sm:py-10'>
						<p className='text-sm text-secondary-foreground/85'>
							O carrinho ainda está vazio
						</p>
						<h2 className='mt-2 max-w-xl font-heading text-2xl font-bold tracking-tight sm:text-3xl'>
							Escolhe um produto e fala com a loja hoje.
						</h2>
						<p className='mt-3 max-w-lg text-sm leading-relaxed text-secondary-foreground/90'>
							O Zuka não cobra. Junta o que queres numa loja e
							envia o pedido directo ao vendedor, como no mercado,
							mas aqui com o telemóvel.
						</p>
						<div className='mt-6 flex flex-col gap-2 sm:flex-row'>
							<Button
								size='lg'
								className='min-h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90'
								render={<Link href='/feed/explorar' />}
							>
								<Compass className='size-4' aria-hidden />
								Explorar produtos
							</Button>
							<Button
								size='lg'
								variant='ghost'
								className='min-h-11 rounded-xl text-secondary-foreground hover:bg-white/15 hover:text-secondary-foreground'
								render={
									<Link href='/feed/explorar?tab=stores' />
								}
							>
								<Store className='size-4' aria-hidden />
								Ver lojas
							</Button>
						</div>
					</div>
				</section>

				<ol className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
					{STEPS.map((step, index) => (
						<li
							key={step.title}
							className='flex gap-4 border-b border-border/60 px-5 py-4 last:border-b-0 sm:px-6'
						>
							<span
								className='font-heading text-xl font-bold tabular-nums text-secondary'
								aria-hidden
							>
								{index + 1}
							</span>
							<div className='min-w-0'>
								<p className='font-medium text-foreground'>
									{step.title}
								</p>
								<p className='mt-0.5 text-sm text-muted-foreground'>
									{step.body}
								</p>
							</div>
						</li>
					))}
				</ol>
			</div>

			<aside
				className='order-1 flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:order-2 lg:w-[min(100%,22rem)] xl:w-96'
				aria-label='Por onde começar'
			>
				<section className='relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-foreground to-foreground/90 p-5 text-background'>
					<div
						aria-hidden
						className='pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-secondary/35 blur-2xl'
					/>
					<div className='relative space-y-3'>
						<h2 className='font-heading text-lg font-bold tracking-tight'>
							Começar agora
						</h2>
						<p className='text-sm leading-relaxed text-background/75'>
							Um produto chega. O botão de carrinho está no
							anúncio e na página do produto.
						</p>
						<div className='flex flex-col gap-2 pt-1'>
							<Button
								className='min-h-11 w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90'
								render={<Link href='/feed/explorar' />}
							>
								Explorar produtos
								<ArrowRight className='size-4' aria-hidden />
							</Button>
							{isAuthenticated ? (
								<Button
									variant='ghost'
									className='min-h-11 w-full rounded-xl text-background hover:bg-white/10 hover:text-background'
									render={
										<Link href='/perfil?tab=Guardados' />
									}
								>
									<Heart className='size-4' aria-hidden />
									Ver favoritos
								</Button>
							) : (
								<Button
									variant='ghost'
									className='min-h-11 w-full rounded-xl text-background hover:bg-white/10 hover:text-background'
									render={<Link href='/mensagens' />}
								>
									<MessageCircle
										className='size-4'
										aria-hidden
									/>
									Abrir mensagens
								</Button>
							)}
						</div>
					</div>
				</section>

				<section className='rounded-2xl border border-dashed border-border/80 bg-muted/25 p-4'>
					<p className='text-xs font-medium text-foreground'>
						Como funciona
					</p>
					<ul className='mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground'>
						<li>
							Podes ter vários carrinhos ao mesmo tempo, um por
							loja.
						</li>
						<li>
							O vendedor confirma o preço e tu combinas com ele a
							entrega.
						</li>
					</ul>
				</section>
			</aside>
		</div>
	)
}
