'use client'

import { sendEmailVerification } from 'firebase/auth'
import { Loader2, MailCheck, MailWarning } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase/firebase-client'

export const EmailVerificationStatus = () => {
	const [verified, setVerified] = useState(false)
	const [sending, setSending] = useState(false)
	const [checked, setChecked] = useState(false)

	useEffect(() => {
		const user = auth.currentUser
		if (user) {
			setVerified(user.emailVerified)
			setChecked(true)
		}
	}, [])

	async function handleVerify() {
		const user = auth.currentUser
		if (!user) return

		setSending(true)
		try {
			await sendEmailVerification(user)
			toast.success(
				'Email de verificação enviado. Verifique a sua caixa de entrada.'
			)
		} catch {
			toast.error('Erro ao enviar email de verificação. Tente novamente.')
		} finally {
			setSending(false)
		}
	}

	if (!checked) return null

	return (
		<div className='flex items-center justify-between rounded-xl border border-border/60 px-4 py-3'>
			<div className='flex items-center gap-3'>
				{verified ? (
					<MailCheck className='size-5 text-emerald-500' />
				) : (
					<MailWarning className='size-5 text-amber-500' />
				)}
				<div>
					<p className='text-sm font-medium'>
						{verified ? 'Email verificado' : 'Email não verificado'}
					</p>
					<p className='text-xs text-muted-foreground'>
						{verified
							? 'O seu email foi confirmado.'
							: 'Confirme o seu email para aceder a todas as funcionalidades.'}
					</p>
				</div>
			</div>

			{!verified && (
				<Button
					variant='outline'
					size='sm'
					onClick={handleVerify}
					disabled={sending}
					className='shrink-0 rounded-full'
				>
					{sending ? (
						<Loader2 className='size-3.5 animate-spin' />
					) : (
						'Verificar'
					)}
				</Button>
			)}
		</div>
	)
}
