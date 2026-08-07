'use client'

import { CheckCircle2, MessageCircle, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { setViewAsBuyerMode } from '@/lib/auth/view-as-buyer'
import { cn } from '@/lib/utils'

const features = [
	{
		icon: CheckCircle2,
		title: 'Lojas verificadas',
		description:
			'A equipe Zuka confirma a identidade das lojas antes de ficarem activas.',
		iconClass: 'bg-emerald-500/10 text-emerald-700',
	},
	{
		icon: Truck,
		title: 'Entrega onde houver',
		description:
			'Muitas lojas entregam em Maputo, Matola e outras zonas — confirma no anúncio.',
		iconClass: 'bg-secondary/10 text-secondary',
	},
	{
		icon: MessageCircle,
		title: 'Fala com a loja',
		description:
			'Contacta por WhatsApp, telefone ou chat directamente no Zuka.',
		iconClass: 'bg-emerald-500/10 text-emerald-700',
	},
]

export const BuyerWelcomeView = () => {
	const router = useRouter()

	return (
		<div className='flex flex-1 flex-col bg-background'>
			<div className='mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14'>
				<div className='mb-10 space-y-4'>
					<p className='text-sm font-medium text-muted-foreground'>
						Conta de comprador pronta
					</p>
					<h1 className='font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl'>
						Tudo o que precisas, perto de ti
					</h1>
					<p className='max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base'>
						Explora produtos locais e contacta as lojas quando
						estiveres pronto.
					</p>
				</div>

				<ul className='space-y-3'>
					{features.map((feature) => (
						<li
							key={feature.title}
							className='flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-4'
						>
							<div
								className={cn(
									'flex size-11 shrink-0 items-center justify-center rounded-full',
									feature.iconClass
								)}
							>
								<feature.icon className='size-5' aria-hidden />
							</div>
							<div className='min-w-0 space-y-1'>
								<p className='font-semibold'>{feature.title}</p>
								<p className='text-sm leading-relaxed text-muted-foreground'>
									{feature.description}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className='sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6'>
				<div className='mx-auto flex w-full max-w-lg flex-col gap-2'>
					<Button
						render={
							<Link
								href='/feed/explorar'
								onClick={() => setViewAsBuyerMode()}
							/>
						}
						className='h-12 w-full rounded-full text-base font-semibold'
						size='lg'
					>
						Começar a explorar
					</Button>
					<Button
						type='button'
						variant='ghost'
						onClick={() => router.push('/onboarding')}
						className='h-11 w-full text-muted-foreground'
					>
						Alterar como uso o Zuka
					</Button>
				</div>
			</div>
		</div>
	)
}
