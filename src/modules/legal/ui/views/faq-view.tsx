'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FAQ_CATEGORIES } from '@/modules/legal/constants/faq'

export function FaqView() {
	const headingId = useId()
	const [activeCategory, setActiveCategory] = useState(
		FAQ_CATEGORIES[0]?.id ?? 'conta'
	)

	useEffect(() => {
		const hash = window.location.hash.replace('#', '')
		if (!hash) return
		const match = FAQ_CATEGORIES.find((c) => c.id === hash)
		if (match) setActiveCategory(match.id)
	}, [])

	const category =
		FAQ_CATEGORIES.find((c) => c.id === activeCategory) ?? FAQ_CATEGORIES[0]

	return (
		<article className='mx-auto max-w-3xl py-8 md:py-14'>
			<header className='mb-8 border-b border-border/60 pb-8 md:mb-10'>
				<p className='text-sm text-muted-foreground'>Ajuda</p>
				<h1
					id={headingId}
					className='mt-2 font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl'
				>
					Perguntas frequentes
				</h1>
				<p className='mt-3 max-w-prose text-base leading-relaxed text-muted-foreground'>
					Respostas curtas sobre conta, compras, lojas, pagamentos e
					privacidade. Escolhe um tema e abre a pergunta.
				</p>
			</header>

			<div className='sticky top-14 z-30 -mx-4 mb-6 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm md:static md:mx-0 md:mb-8 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none'>
				<nav
					aria-label='Temas do FAQ'
					className='-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0'
				>
					{FAQ_CATEGORIES.map((cat) => {
						const selected = cat.id === activeCategory
						return (
							<button
								key={cat.id}
								type='button'
								aria-pressed={selected}
								onClick={() => {
									setActiveCategory(cat.id)
									window.history.replaceState(
										null,
										'',
										`#${cat.id}`
									)
								}}
								className={cn(
									'min-h-11 shrink-0 rounded-xl px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
									selected
										? 'bg-primary text-primary-foreground'
										: 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
								)}
							>
								{cat.label}
							</button>
						)
					})}
				</nav>
			</div>

			<section
				aria-labelledby={`${category.id}-heading`}
				id={category.id}
				className='scroll-mt-32 md:scroll-mt-24'
			>
				<h2
					id={`${category.id}-heading`}
					className='mb-1 font-heading text-xl font-bold tracking-tight'
				>
					{category.label}
				</h2>
				<p className='mb-4 text-sm text-muted-foreground'>
					{category.items.length}{' '}
					{category.items.length === 1 ? 'pergunta' : 'perguntas'}
				</p>

				<Accordion
					key={category.id}
					multiple
					className='rounded-2xl border border-border/60 px-4 md:px-5'
				>
					{category.items.map((item) => (
						<AccordionItem key={item.id} value={item.id}>
							<AccordionTrigger className='min-h-12 py-4 text-[15px] leading-snug md:text-base'>
								<span className='pr-3'>{item.question}</span>
							</AccordionTrigger>
							<AccordionContent className='text-[15px] leading-relaxed text-muted-foreground md:text-base'>
								<p>{item.answer}</p>
								{item.links && item.links.length > 0 ? (
									<ul className='mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
										{item.links.map((link) => (
											<li key={link.href + link.label}>
												<Link
													href={link.href}
													className='inline-flex min-h-11 items-center font-medium text-secondary underline-offset-2 hover:underline'
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								) : null}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>

			<footer className='mt-12 rounded-2xl border border-border/60 bg-muted/20 px-5 py-6 md:mt-14 md:px-6'>
				<h2 className='font-heading text-lg font-bold tracking-tight'>
					Ainda com dúvidas?
				</h2>
				<p className='mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-[15px]'>
					Escreve para{' '}
					<a
						href='mailto:ola@zuka.co.mz'
						className='font-medium text-secondary underline-offset-2 hover:underline'
					>
						ola@zuka.co.mz
					</a>{' '}
					com o email da tua conta e, se for o caso, o número do
					pedido.
				</p>
				<div className='mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
					<a
						href='mailto:ola@zuka.co.mz'
						className={cn(
							buttonVariants({ variant: 'default' }),
							'min-h-11 rounded-xl px-4'
						)}
					>
						Enviar email
					</a>
					<Link
						href='/termos'
						className={cn(
							buttonVariants({ variant: 'outline' }),
							'min-h-11 rounded-xl px-4'
						)}
					>
						Ver Termos
					</Link>
					<Link
						href='/privacidade'
						className={cn(
							buttonVariants({ variant: 'outline' }),
							'min-h-11 rounded-xl px-4'
						)}
					>
						Ver Privacidade
					</Link>
				</div>
			</footer>
		</article>
	)
}
