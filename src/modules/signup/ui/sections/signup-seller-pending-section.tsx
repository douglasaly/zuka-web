'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SignupSellerPendingSection() {
	return (
		<div className='flex flex-1 flex-col items-center justify-center px-4 py-12'>
			<div className='w-full max-w-md space-y-8 text-center'>
				<div className='mx-auto flex size-24 items-center justify-center rounded-full bg-orange-50'>
					<Clock className='size-12 text-secondary' />
				</div>

				<div className='space-y-3'>
					<h1 className='font-heading text-2xl font-bold sm:text-3xl'>
						A tua loja está em revisão!
					</h1>
					<p className='text-sm leading-relaxed text-muted-foreground sm:text-base'>
						A nossa Equipe vai verificar os teus dados. Vais receber
						uma notificação quando a tua conta for aprovada.
					</p>
				</div>

				<Button
					render={<Link href='/'>Voltar ao início</Link>}
					variant='outline'
					className='h-12 w-full rounded-full text-base font-semibold'
					size='lg'
				/>
			</div>
		</div>
	)
}
