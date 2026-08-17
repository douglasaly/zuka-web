'use client'
import { KeyRound, Loader2 } from 'lucide-react'
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
import { PasswordToggleField } from '../components/password-toggle-field'

type Requirement = {
	label: string
	met: boolean
}
type ChangePasswordFormProps = {
	currentPassword: string
	newPassword: string
	confirmPassword: string
	loading: boolean
	showCurrent: boolean
	showNew: boolean
	passwordRequirements: Requirement[]
	onCurrentChange: (value: string) => void
	onNewChange: (value: string) => void
	onConfirmChange: (value: string) => void
	onToggleCurrent: () => void
	onToggleNew: () => void
	onSubmit: (e: React.FormEvent) => void
	onCancel: () => void
}
export function ChangePasswordForm({
	currentPassword,
	newPassword,
	confirmPassword,
	loading,
	showCurrent,
	showNew,
	passwordRequirements,
	onCurrentChange,
	onNewChange,
	onConfirmChange,
	onToggleCurrent,
	onToggleNew,
	onSubmit,
	onCancel,
}: ChangePasswordFormProps) {
	return (
		<Card className='border-border/60'>
			<form onSubmit={onSubmit}>
				<CardHeader>
					<div className='flex size-12 items-center justify-center rounded-full bg-secondary/10 mb-3'>
						<KeyRound className='size-6 text-secondary' />
					</div>
					<CardTitle className='font-heading'>Nova senha</CardTitle>
					<CardDescription>
						Precisa da sua senha atual por segurança.
					</CardDescription>
				</CardHeader>

				<CardContent className='space-y-5'>
					<div className='space-y-2'>
						<Label htmlFor='current-password'>Senha atual</Label>
						<PasswordToggleField
							id='current-password'
							value={currentPassword}
							onChange={onCurrentChange}
							visible={showCurrent}
							onToggleVisible={onToggleCurrent}
							autoComplete='current-password'
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='new-password'>Nova palavra-passe</Label>
						<PasswordToggleField
							id='new-password'
							value={newPassword}
							onChange={onNewChange}
							visible={showNew}
							onToggleVisible={onToggleNew}
							autoComplete='new-password'
							minLength={6}
							required
						/>
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
							onChange={(e) => onConfirmChange(e.target.value)}
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
						onClick={onCancel}
					>
						Cancelar
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
}
