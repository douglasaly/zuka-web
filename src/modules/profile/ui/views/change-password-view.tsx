'use client'

import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from 'firebase/auth'
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
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

export const ChangePasswordView = () => {
	const router = useRouter()
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [showCurrent, setShowCurrent] = useState(false)
	const [showNew, setShowNew] = useState(false)

	const passwordRequirements = [
		{ label: 'Pelo menos 6 caracteres', met: newPassword.length >= 6 },
		{
			label: 'As senhas coincidem',
			met: newPassword === confirmPassword && newPassword.length > 0,
		},
	]

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)

		if (newPassword.length < 6) {
			toast.error(
				'A nova palavra-passe deve ter pelo menos 6 caracteres.'
			)
			setLoading(false)
			return
		}

		if (newPassword !== confirmPassword) {
			toast.error('As novas palavras-passe não coincidem.')
			setLoading(false)
			return
		}

		try {
			const user = auth.currentUser

			if (!user || !user.email) {
				toast.error('Sessão expirada. Faça login novamente.')
				setLoading(false)
				return
			}

			const credential = EmailAuthProvider.credential(
				user.email,
				currentPassword
			)
			await reauthenticateWithCredential(user, credential)

			await updatePassword(user, newPassword)

			toast.success('Palavra-passe alterada com sucesso.')
			router.push('/perfil/definicoes')
		} catch (err: unknown) {
			const firebaseCode =
				err && typeof err === 'object' && 'code' in err
					? String((err as { code: string }).code)
					: ''

			const messages: Record<string, string> = {
				'auth/wrong-password': 'A senha atual está incorreta.',
				'auth/requires-recent-login':
					'Por segurança, faça login novamente antes de alterar a senha.',
				'auth/weak-password':
					'A nova senha é muito fraca. Escolha uma mais segura.',
				'auth/invalid-credential': 'A senha atual está incorreta.',
			}

			toast.error(
				messages[firebaseCode] ||
					'Erro ao alterar palavra-passe. Tente novamente.'
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<div className='mb-8 flex items-center gap-2'>
				<Button variant='ghost' onClick={() => router.back()}>
					<ArrowLeft className='size-4' />
				</Button>
				<div>
					<h1 className='font-heading text-2xl font-bold md:text-3xl'>
						Alterar palavra-passe
					</h1>
					<p className='text-sm text-muted-foreground'>
						Defina uma nova senha para a sua conta
					</p>
				</div>
			</div>

			<Card className='border-border/60'>
				<form onSubmit={handleSubmit}>
					<CardHeader>
						<div className='flex size-12 items-center justify-center rounded-full bg-secondary/10 mb-3'>
							<KeyRound className='size-6 text-secondary' />
						</div>
						<CardTitle className='font-heading'>
							Nova senha
						</CardTitle>
						<CardDescription>
							Precisa da sua senha atual por segurança.
						</CardDescription>
					</CardHeader>

					<CardContent className='space-y-5'>
						<div className='space-y-2'>
							<Label htmlFor='current-password'>
								Senha atual
							</Label>
							<div className='relative'>
								<Input
									id='current-password'
									type={showCurrent ? 'text' : 'password'}
									placeholder='••••••••'
									value={currentPassword}
									onChange={(e) =>
										setCurrentPassword(e.target.value)
									}
									autoComplete='current-password'
									required
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon-sm'
									className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground'
									onClick={() => setShowCurrent(!showCurrent)}
								>
									{showCurrent ? (
										<EyeOff className='size-4' />
									) : (
										<Eye className='size-4' />
									)}
								</Button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='new-password'>
								Nova palavra-passe
							</Label>
							<div className='relative'>
								<Input
									id='new-password'
									type={showNew ? 'text' : 'password'}
									placeholder='••••••••'
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									autoComplete='new-password'
									minLength={6}
									required
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon-sm'
									className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground'
									onClick={() => setShowNew(!showNew)}
								>
									{showNew ? (
										<EyeOff className='size-4' />
									) : (
										<Eye className='size-4' />
									)}
								</Button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='confirm-password'>
								Confirmar nova palavra-passe
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

						<ul className='space-y-1.5'>
							{passwordRequirements.map((req) => (
								<li
									key={req.label}
									className='flex items-center gap-2 text-xs'
								>
									<div
										className={`size-1.5 rounded-full ${
											req.met
												? 'bg-emerald-500'
												: 'bg-muted-foreground/30'
										}`}
									/>
									<span
										className={
											req.met
												? 'text-emerald-600'
												: 'text-muted-foreground'
										}
									>
										{req.label}
									</span>
								</li>
							))}
						</ul>
					</CardContent>

					<CardFooter className='flex-col gap-3 border-t border-border/60 pt-6'>
						<Button
							type='submit'
							disabled={loading}
							className='w-full rounded-full'
						>
							{loading ? (
								<>
									<Loader2 className='mr-2 size-4 animate-spin' />
									A alterar...
								</>
							) : (
								'Alterar palavra-passe'
							)}
						</Button>
						<Button
							type='button'
							variant='outline'
							className='w-full rounded-full'
							onClick={() => router.push('/perfil/definicoes')}
						>
							Cancelar
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}
