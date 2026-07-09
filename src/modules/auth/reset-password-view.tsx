'use client'

import { sendPasswordResetEmail } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/firebase/firebase-client'

export const ResetPasswordView = () => {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			await sendPasswordResetEmail(auth, email, {
				url: `${window.location.origin}/auth/redefinir`,
				handleCodeInApp: true,
			})

			router.push(`/auth/recuperar/confirmacao?email=${encodeURIComponent(email)}`)
		} catch (err: unknown) {
			const firebaseCode =
				err && typeof err === 'object' && 'code' in err
					? String((err as { code: string }).code)
					: ''

			const messages: Record<string, string> = {
				'auth/user-not-found':
					'Não existe conta com este email.',
				'auth/invalid-email':
					'Email inválido. Verifique o endereço.',
				'auth/too-many-requests':
					'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
			}

			setError(
				messages[firebaseCode] ||
					'Ocorreu um erro ao enviar o email. Tente novamente.'
			)
		} finally {
			setLoading(false)
		}
	}

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
						<CardTitle className='font-heading text-xl'>
							Recuperar palavra-passe
						</CardTitle>
						<CardDescription>
							Introduza o seu email e enviaremos um link para
							redefinir a sua palavra-passe.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form
							onSubmit={handleSubmit}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label htmlFor='reset-email'>Email</Label>
								<Input
									id='reset-email'
									type='email'
									placeholder='seu@email.com'
									value={email}
									onChange={(e) =>
										setEmail(e.target.value)
									}
									autoComplete='email'
									required
								/>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full rounded-full'
							>
								{loading
									? 'A enviar...'
									: 'Enviar link de recuperação'}
							</Button>

							{error && (
								<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
									{error}
								</p>
							)}
						</form>
					</CardContent>

					<CardFooter className='justify-center border-t border-border/60 pt-6'>
						<p className='text-sm text-muted-foreground'>
							Lembrou-se da senha?{' '}
							<Link
								href='/auth/login'
								className='font-medium text-secondary hover:underline'
							>
								Entrar
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
