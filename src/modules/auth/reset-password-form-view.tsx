'use client'

import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { KeyRound, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/firebase/firebase-client'

function ResetForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const oobCode = searchParams.get('oobCode')
	const mode = searchParams.get('mode')

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [validating, setValidating] = useState(true)
	const [codeValid, setCodeValid] = useState(false)

	useEffect(() => {
		async function validateCode() {
			if (mode !== 'resetPassword' || !oobCode) {
				setValidating(false)
				return
			}

			try {
				await verifyPasswordResetCode(auth, oobCode)
				setCodeValid(true)
			} catch {
				setError(
					'O link de redefinição é inválido ou expirou. Solicite um novo.'
				)
			} finally {
				setValidating(false)
			}
		}

		validateCode()
	}, [oobCode, mode])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)

		if (password.length < 6) {
			setError('A palavra-passe deve ter pelo menos 6 caracteres.')
			setLoading(false)
			return
		}

		if (password !== confirmPassword) {
			setError('As palavras-passe não coincidem.')
			setLoading(false)
			return
		}

		try {
			await confirmPasswordReset(auth, oobCode!, password)
			router.push('/auth/login?reset=success')
		} catch (err: unknown) {
			const firebaseCode =
				err && typeof err === 'object' && 'code' in err
					? String((err as { code: string }).code)
					: ''

			const messages: Record<string, string> = {
				'auth/expired-action-code':
					'O link expirou. Solicite um novo.',
				'auth/invalid-action-code':
					'O link é inválido. Solicite um novo.',
				'auth/weak-password':
					'A palavra-passe é muito fraca. Escolha uma mais segura.',
			}

			setError(
				messages[firebaseCode] ||
					'Ocorreu um erro ao redefinir a palavra-passe. Tente novamente.'
			)
		} finally {
			setLoading(false)
		}
	}

	if (validating) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-muted/25 px-4 py-12'>
				<Loader2 className='size-6 animate-spin text-muted-foreground' />
			</div>
		)
	}

	if (!codeValid) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-muted/25 px-4 py-12'>
				<div className='w-full max-w-md space-y-6'>
					<div className='text-center'>
						<Link
							href='/'
							className='inline-flex items-center gap-2.5'
						>
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
								Link inválido
							</CardTitle>
							<CardDescription>{error}</CardDescription>
						</CardHeader>

						<CardContent className='space-y-3'>
							<Button
								render={
									<Link href='/auth/recuperar'>
										Solicitar novo link
									</Link>
								}
								className='w-full rounded-full'
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		)
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
						<div className='flex justify-center mb-2'>
							<div className='flex size-12 items-center justify-center rounded-full bg-secondary/10'>
								<KeyRound className='size-6 text-secondary' />
							</div>
						</div>
						<CardTitle className='font-heading text-xl text-center'>
							Redefinir palavra-passe
						</CardTitle>
						<CardDescription className='text-center'>
							Escolha uma nova palavra-passe para a sua conta.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form
							onSubmit={handleSubmit}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label htmlFor='new-password'>
									Nova palavra-passe
								</Label>
								<Input
									id='new-password'
									type='password'
									placeholder='••••••••'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									autoComplete='new-password'
									minLength={6}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='confirm-password'>
									Confirmar palavra-passe
								</Label>
								<Input
									id='confirm-password'
									type='password'
									placeholder='••••••••'
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									autoComplete='new-password'
									minLength={6}
									required
								/>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='w-full rounded-full'
							>
								{loading
									? 'A redefinir...'
									: 'Redefinir palavra-passe'}
							</Button>

							{error && (
								<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
									{error}
								</p>
							)}
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export const ResetPasswordFormView = () => (
	<Suspense>
		<ResetForm />
	</Suspense>
)
