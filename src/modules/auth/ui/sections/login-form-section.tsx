'use client'
import Link from 'next/link'
import { GoogleIcon } from '@/components/google-icon'
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

type LoginFormSectionProps = {
	email: string
	password: string
	loading: boolean
	error: string | null
	onEmailChange: (value: string) => void
	onPasswordChange: (value: string) => void
	onEmailLogin: (e: React.FormEvent) => void
	onGoogleLogin: () => void
}
export function LoginFormSection({
	email,
	password,
	loading,
	error,
	onEmailChange,
	onPasswordChange,
	onEmailLogin,
	onGoogleLogin,
}: LoginFormSectionProps) {
	return (
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
				<form onSubmit={onEmailLogin} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='seu@email.com'
							value={email}
							onChange={(e) => onEmailChange(e.target.value)}
							autoComplete='email'
							required
						/>
					</div>

					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='password'>Senha</Label>
							<Link
								href='/auth/recuperar'
								className='text-xs text-secondary hover:underline'
							>
								Esqueceu-se da palavra-passe?
							</Link>
						</div>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							value={password}
							onChange={(e) => onPasswordChange(e.target.value)}
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
					onClick={onGoogleLogin}
					disabled={loading}
					className='w-full rounded-full'
				>
					<GoogleIcon className='size-5' />
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
	)
}
