'use client'

import { CheckCircle2, MessageCircle, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const features = [
	{
		icon: CheckCircle2,
		title: 'Lojas verificadas',
		description:
			'Todas as lojas são verificadas pela nossa equipa para garantir confiança',
		iconClass: 'bg-emerald-50 text-emerald-600',
	},
	{
		icon: Truck,
		title: 'Entrega em Maputo',
		description:
			'Entrega ao domicílio disponível em Maputo Cidade, Matola e mais',
		iconClass: 'bg-red-50 text-secondary',
	},
	{
		icon: MessageCircle,
		title: 'Contacto via WhatsApp',
		description:
			'Fala diretamente com o vendedor pelo WhatsApp para tirar dúvidas',
		iconClass: 'bg-emerald-50 text-emerald-600',
	},
]

export const BuyerWelcomeView = () => {
	const router = useRouter()

	return (
		<div className='flex flex-1 flex-col bg-background'>
			<div className='mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14'>
				<div className='mb-10 space-y-6'>
					<div className='flex size-12 items-center justify-center rounded-2xl bg-muted text-lg font-extrabold text-muted-foreground'>
						Z
					</div>
					<h1 className='font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl'>
						Tudo o que precisas, perto de ti
					</h1>
				</div>

				<div className='space-y-3'>
					{features.map((feature) => (
						<div
							key={feature.title}
							className='flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-4'
						>
							<div
								className={cn(
									'flex size-11 shrink-0 items-center justify-center rounded-full',
									feature.iconClass
								)}
							>
								<feature.icon className='size-5' />
							</div>
							<div className='min-w-0 space-y-1'>
								<p className='font-semibold'>{feature.title}</p>
								<p className='text-sm leading-relaxed text-muted-foreground'>
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6'>
				<div className='mx-auto w-full max-w-lg'>
					<Button
						render={<Link href='/feed/explorar' />}
						className='h-12 w-full rounded-full text-base font-semibold'
						size='lg'
					>
						Começar a explorar
					</Button>
					<Button
						type='button'
						variant='ghost'
						onClick={() => router.push('/onboarding')}
						className='mt-2 w-full text-muted-foreground'
					>
						Voltar
					</Button>
				</div>
			</div>
		</div>
	)
}
