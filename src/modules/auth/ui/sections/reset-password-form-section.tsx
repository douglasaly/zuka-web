import { KeyRound } from 'lucide-react'
import Link from 'next/link'
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

interface Props {
	password: string
	onPasswordChange: (v: string) => void
	confirmPassword: string
	onConfirmPasswordChange: (v: string) => void
	loading: boolean
	error: string | null
	onSubmit: (e: React.FormEvent) => void
}
export function ResetPasswordFormSection({
	password,
	onPasswordChange,
	confirmPassword,
	onConfirmPasswordChange,
	loading,
	error,
	onSubmit,
}: Props) {
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
						<div className='mb-2 flex justify-center'>
							<div className='flex size-12 items-center justify-center rounded-full bg-secondary/10'>
								<KeyRound className='size-6 text-secondary' />
							</div>
						</div>
						<CardTitle className='text-center font-heading text-xl'>
							Redefinir palavra-passe
						</CardTitle>
						<CardDescription className='text-center'>
							Escolha uma nova palavra-passe para a sua conta.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={onSubmit} className='space-y-4'>
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
										onPasswordChange(e.target.value)
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
										onConfirmPasswordChange(e.target.value)
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
