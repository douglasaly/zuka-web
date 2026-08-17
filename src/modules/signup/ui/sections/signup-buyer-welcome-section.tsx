'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BUYER_FEATURES } from '../../constants'
export function SignupBuyerWelcomeSection() {
	return (
		<div className='flex flex-1 flex-col'>
			<div className='mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6'>
				<div className='mb-10 space-y-4'>
					<div className='flex size-12 items-center justify-center rounded-2xl bg-muted text-lg font-extrabold text-muted-foreground'>
						Z
					</div>
					<h1 className='font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl'>
						Tudo o que precisas,{' '}
						<span className='block'>perto de ti</span>
					</h1>
				</div>

				<div className='space-y-3'>
					{BUYER_FEATURES.map((f) => (
						<div
							key={f.title}
							className='flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-4'
						>
							<div
								className={cn(
									'flex size-11 shrink-0 items-center justify-center rounded-full',
									f.iconClass
								)}
							>
								<f.icon className='size-5' />
							</div>
							<div className='space-y-1'>
								<p className='font-semibold'>{f.title}</p>
								<p className='text-sm leading-relaxed text-muted-foreground'>
									{f.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6'>
				<div className='mx-auto w-full max-w-lg'>
					<Button
						render={
							<Link href='/feed/explorar'>
								Começar a explorar
							</Link>
						}
						className='h-12 w-full rounded-full text-base font-semibold'
						size='lg'
					/>
				</div>
			</div>
		</div>
	)
}
