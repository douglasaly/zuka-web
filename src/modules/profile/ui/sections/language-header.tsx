import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function LanguageHeader() {
	return (
		<header className='space-y-5'>
			<Link
				href='/perfil/definicoes'
				className='inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-full pr-3 text-sm font-medium text-foreground outline-none transition-colors active:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [@media(hover:hover)]:hover:bg-muted/60'
			>
				<ArrowLeft className='size-4 shrink-0' aria-hidden />
				Definições
			</Link>
			<div className='space-y-1.5'>
				<h1 className='font-heading text-[1.75rem] font-bold leading-tight tracking-tight sm:text-3xl'>
					Idioma
				</h1>
				<p className='max-w-[40ch] text-base leading-relaxed text-muted-foreground'>
					Escolha o idioma da app.
				</p>
			</div>
		</header>
	)
}
