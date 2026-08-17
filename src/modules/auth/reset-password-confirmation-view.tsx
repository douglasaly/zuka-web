'use client'
import { MailCheck } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

function ConfirmationContent() {
	const searchParams = useSearchParams()
	const email = searchParams.get('email') ?? ''
	return (
		<div className='flex min-h-screen items-center justify-center bg-muted/25 px-4 py-12'>
			<div className='w-full max-w-md space-y-6'>
				<div className='text-center'>
					<Link href='/' className='inline-flex items-center gap-2.5'>
						<div className='flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground'>
							Z
						</div>
						<span className='font-heading text-2xl font-bold tracking-tight'>
							Zuka
						</span>
					</Link>
				</div>

				<Card className='border-border/60'>
					<CardHeader className='space-y-1'>
						<div className='flex justify-center mb-2'>
							<div className='flex size-12 items-center justify-center rounded-full bg-secondary/10'>
								<MailCheck className='size-6 text-secondary' />
							</div>
						</div>
						<CardTitle className='font-heading text-xl text-center'>
							Email enviado
						</CardTitle>
						<CardDescription className='text-center'>
							Se existir uma conta com{' '}
							<span className='font-medium text-foreground'>
								{email}
							</span>
							, receberá um link para redefinir a sua
							palavra-passe dentro de alguns minutos.
						</CardDescription>
					</CardHeader>

					<CardContent className='space-y-3 text-sm text-muted-foreground'>
						<p>
							Não recebeu o email? Verifique a pasta de spam ou
							tente novamente.
						</p>
					</CardContent>

					<CardFooter className='flex-col gap-3 border-t border-border/60 pt-6'>
						<Button
							render={
								<Link href='/auth/recuperar'>
									Tentar novamente
								</Link>
							}
							variant='outline'
							className='w-full rounded-full'
						/>
						<Button
							render={
								<Link href='/auth/login'>Voltar ao login</Link>
							}
							className='w-full rounded-full'
						/>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
export const ResetPasswordConfirmationView = () => {
	return (
		<Suspense>
			<ConfirmationContent />
		</Suspense>
	)
}
