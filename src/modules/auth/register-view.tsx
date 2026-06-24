'use client'

import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from 'firebase/auth'
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
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/firebase/firebase-client'
import { createAppSession } from '@/lib/firebase/create-session'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'

export const RegisterView = () => {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleEmailRegister(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)

			if (name) {
				await updateProfile(userCredential.user, {
					displayName: name,
				})
			}

			await syncUserToBackend()
			await createAppSession()
			router.push('/onboarding')
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Erro ao registar')
		} finally {
			setLoading(false)
		}
	}

	async function handleGoogleRegister() {
		setLoading(true)
		setError(null)

		try {
			const provider = new GoogleAuthProvider()
			await signInWithPopup(auth, provider)
			await syncUserToBackend()
			await createAppSession()
			router.push('/onboarding')
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Erro ao registar')
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
					<p className='mt-2 text-sm text-muted-foreground'>
						Junte-se ao marketplace moçambicano
					</p>
				</div>

				<Card className='border-border/60'>
					<CardHeader className='space-y-1'>
						<CardTitle className='font-heading text-xl'>
							Criar conta
						</CardTitle>
						<CardDescription>
							Registe-se para comprar ou vender no Zuka
						</CardDescription>
					</CardHeader>

					<CardContent className='space-y-4'>
						<form onSubmit={handleEmailRegister} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Nome</Label>
								<Input
									id='name'
									type='text'
									placeholder='O seu nome'
									value={name}
									onChange={(e) => setName(e.target.value)}
									autoComplete='name'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='seu@email.com'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete='email'
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='password'>Senha</Label>
								<Input
									id='password'
									type='password'
									placeholder='Mínimo 6 caracteres'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete='new-password'
									required
									minLength={6}
								/>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full rounded-full'
							>
								{loading ? 'A criar conta...' : 'Criar conta'}
							</Button>
						</form>

						<div className='flex items-center gap-3'>
							<Separator className='flex-1' />
							<span className='text-xs text-muted-foreground'>
								ou
							</span>
							<Separator className='flex-1' />
						</div>

						<Button
							type='button'
							variant='outline'
							onClick={handleGoogleRegister}
							disabled={loading}
							className='w-full rounded-full'
						>
							Continuar com Google
						</Button>

						{error && (
							<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
								{error}
							</p>
						)}
					</CardContent>

					<CardFooter className='justify-center border-t border-border/60 pt-6'>
						<p className='text-sm text-muted-foreground'>
							Já tem conta?{' '}
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
