'use client'
import { ShoppingBag, Store } from 'lucide-react'
import Link from 'next/link'

type SignupRoleSectionProps = {
	onSelectBuyer: () => void
	onSelectSeller: () => void
}
export function SignupRoleSection({
	onSelectBuyer,
	onSelectSeller,
}: SignupRoleSectionProps) {
	return (
		<div className='flex flex-1 items-center justify-center px-4 py-12'>
			<div className='w-full max-w-md space-y-8'>
				<div className='space-y-2'>
					<h1 className='font-heading text-xl font-bold'>
						Como queres usar o Zuka?
					</h1>
					<p className='text-sm text-muted-foreground'>
						Escolhe como queres começar
					</p>
				</div>

				<div className='space-y-3'>
					<button
						type='button'
						onClick={onSelectBuyer}
						className='group w-full text-left'
					>
						<div className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border'>
							<div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50'>
								<ShoppingBag className='size-5 text-secondary' />
							</div>
							<div>
								<p className='font-semibold text-foreground transition-colors group-hover:text-secondary'>
									Quero comprar
								</p>
								<p className='text-sm text-muted-foreground'>
									Descobre produtos e lojas locais em
									Moçambique
								</p>
							</div>
						</div>
					</button>

					<button
						type='button'
						onClick={onSelectSeller}
						className='group w-full text-left'
					>
						<div className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border'>
							<div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50'>
								<Store className='size-5 text-emerald-700' />
							</div>
							<div>
								<p className='font-semibold text-foreground transition-colors group-hover:text-secondary'>
									Tenho uma loja
								</p>
								<p className='text-sm text-muted-foreground'>
									Vende os teus produtos para milhares de
									clientes
								</p>
							</div>
						</div>
					</button>
				</div>

				<p className='text-center text-xs leading-relaxed text-muted-foreground'>
					Ao continuar aceitas os{' '}
					<Link
						href='/termos-e-condicoes'
						className='font-semibold text-foreground hover:underline'
					>
						Termos de Uso
					</Link>{' '}
					e a{' '}
					<Link
						href='/privacidade'
						className='font-semibold text-foreground hover:underline'
					>
						Política de Privacidade
					</Link>
				</p>
			</div>
		</div>
	)
}
