'use client'

import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
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
import { fetchUserProfile } from '@/lib/api/marketplace'
import { getPostLoginPath } from '@/lib/auth/routing'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'

function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const next = searchParams.get('next')

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function createSession(idToken: string) {
		const res = await fetch('/api/auth/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ token: idToken }),
		})

		if (!res.ok) {
			throw new Error('Falha ao criar sessão')
		}
	}

	async function finishLogin(idToken: string) {
		await createSession(idToken)
		await syncUserToBackend()
		const profile = await fetchUserProfile()
		router.push(getPostLoginPath(profile, next))
	}

	async function handleEmailLogin(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)
			const token = await userCredential.user.getIdToken()
			await finishLogin(token)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Erro ao entrar')
		} finally {
			setLoading(false)
		}
	}

	async function handleGoogleLogin() {
		setLoading(true)
		setError(null)

		try {
			const provider = new GoogleAuthProvider()
			const result = await signInWithPopup(auth, provider)
			const token = await result.user.getIdToken()
			await finishLogin(token)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Erro ao entrar')
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
						Bem-vindo de volta ao marketplace
					</p>
				</div>

				<Card className='border-border/60'>
					<CardHeader className='space-y-1'>
						<CardTitle className='font-heading text-xl'>
							Entrar na conta
						</CardTitle>
						<CardDescription>
							Introduza as suas credenciais para continuar
						</CardDescription>
					</CardHeader>

					<CardContent className='space-y-4'>
						<form onSubmit={handleEmailLogin} className='space-y-4'>
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
									placeholder='••••••••'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete='current-password'
									required
								/>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full rounded-full'
							>
								{loading ? 'A entrar...' : 'Entrar'}
							</Button>
						</form>

						<div className='flex items-center gap-3'>
							<Separator className='flex-1' />
							<span className='text-xs text-muted-foreground'>ou</span>
							<Separator className='flex-1' />
						</div>

						<Button
							type='button'
							variant='outline'
							onClick={handleGoogleLogin}
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
							Não tem conta?{' '}
							<Link
								href='/auth/register'
								className='font-medium text-secondary hover:underline'
							>
								Criar conta
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}

export default function LoginView() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	)
}
