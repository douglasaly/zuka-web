import Link from 'next/link'
import type { ReactNode } from 'react'

type LegalSection = {
	id: string
	title: string
	content: ReactNode
}
type LegalDocumentProps = {
	title: string
	subtitle: string
	updatedAt: string
	sections: LegalSection[]
	relatedHref: string
	relatedLabel: string
}
export function LegalDocument({
	title,
	subtitle,
	updatedAt,
	sections,
	relatedHref,
	relatedLabel,
}: LegalDocumentProps) {
	return (
		<article className='mx-auto max-w-3xl py-10 md:py-14'>
			<header className='mb-10 border-b border-border/60 pb-8'>
				<h1 className='mt-2 font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl'>
					{title}
				</h1>
				<p className='mt-3 max-w-prose text-base leading-relaxed text-muted-foreground'>
					{subtitle}
				</p>
				<p className='mt-4 text-sm text-muted-foreground'>
					Actualizado em{' '}
					<time dateTime={updatedAt}>
						{new Date(updatedAt).toLocaleDateString('pt-MZ', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
					</time>
				</p>
			</header>

			<nav
				aria-label='Secções deste documento'
				className='mb-10 rounded-2xl border border-border/60 bg-muted/20 px-5 py-4'
			>
				<p className='mb-2 text-sm font-semibold text-foreground'>
					Nesta página
				</p>
				<ol className='space-y-1.5 text-sm'>
					{sections.map((section, index) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className='text-muted-foreground transition-colors hover:text-secondary'
							>
								{index + 1}. {section.title}
							</a>
						</li>
					))}
				</ol>
			</nav>

			<div className='space-y-10'>
				{sections.map((section, index) => (
					<section
						key={section.id}
						id={section.id}
						className='scroll-mt-24'
					>
						<h2 className='font-heading text-xl font-bold tracking-tight text-balance'>
							{index + 1}. {section.title}
						</h2>
						<div className='mt-3 max-w-prose space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-secondary [&_a]:underline-offset-2 hover:[&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5'>
							{section.content}
						</div>
					</section>
				))}
			</div>

			<footer className='mt-14 border-t border-border/60 pt-8 text-sm text-muted-foreground'>
				<p>
					Dúvidas sobre este documento? Escreva para{' '}
					<a
						href='mailto:ola@zuka.co.mz'
						className='font-medium text-secondary'
					>
						ola@zuka.co.mz
					</a>
					.
				</p>
				<p className='mt-3'>
					Documento relacionado:{' '}
					<Link
						href={relatedHref}
						className='font-medium text-secondary'
					>
						{relatedLabel}
					</Link>
					.
				</p>
			</footer>
		</article>
	)
}
