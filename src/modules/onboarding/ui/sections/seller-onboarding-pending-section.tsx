'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { setViewAsBuyerMode } from '@/lib/auth/view-as-buyer'

export function SellerOnboardingPendingSection() {
	return (
		<div className='flex flex-1 flex-col items-center justify-center bg-background px-4 py-12'>
			<div className='w-full max-w-md space-y-8 text-center'>
				<div className='mx-auto flex size-20 items-center justify-center rounded-full bg-secondary/10 sm:size-24'>
					<Clock
						className='size-10 text-secondary sm:size-12'
						aria-hidden
					/>
				</div>

				<div className='space-y-3'>
					<p className='text-sm font-medium text-muted-foreground'>
						Pedido enviado
					</p>
					<h1 className='font-heading text-2xl font-bold tracking-tight text-balance sm:text-3xl'>
						A tua loja está em revisão
					</h1>
					<p className='text-sm leading-relaxed text-muted-foreground sm:text-base'>
						A equipe Zuka vai confirmar os teus dados. Recebes uma
						notificação quando fores aprovado, até lá podes
						continuar a explorar o marketplace.
					</p>
				</div>

				<div className='space-y-2'>
					<Button
						render={
							<Link
								href='/'
								onClick={() => setViewAsBuyerMode()}
							/>
						}
						className='h-12 w-full rounded-full text-base font-semibold'
						size='lg'
					>
						Ir para o marketplace
					</Button>
					<p className='text-xs text-muted-foreground'>
						O painel do vendedor fica disponível após aprovação.
					</p>
				</div>
			</div>
		</div>
	)
}
