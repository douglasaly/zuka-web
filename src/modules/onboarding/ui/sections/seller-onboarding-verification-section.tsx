'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { VerificationFormState } from '../../hooks/use-seller-onboarding'
import { FileUploadCard } from '../components/file-upload-card'
import { OnboardingShell } from '../components/onboarding-shell'

type SellerOnboardingVerificationSectionProps = {
	form: VerificationFormState
	onChange: (patch: Partial<VerificationFormState>) => void
	error: string | null
	isPending: boolean
	onBack: () => void
	onSubmit: () => void
}

export function SellerOnboardingVerificationSection({
	form,
	onChange,
	error,
	isPending,
	onBack,
	onSubmit,
}: SellerOnboardingVerificationSectionProps) {
	return (
		<OnboardingShell
			title='Confirma a tua identidade'
			subtitle='Envia o documento e uma selfie. A equipe Zuka revê o pedido — normalmente em até 24 horas.'
			currentStep={3}
			onBack={onBack}
			maxWidth='lg'
			footer={
				<Button
					type='button'
					className='h-12 w-full rounded-full text-base font-semibold'
					disabled={isPending || !form.idCardUrl || !form.selfieUrl}
					onClick={onSubmit}
				>
					{isPending ? 'A enviar documentos…' : 'Enviar para revisão'}
				</Button>
			}
		>
			<div className='grid gap-4 sm:grid-cols-2'>
				<FileUploadCard
					label='Documento de identificação'
					hint='BI ou passaporte, foto nítida da frente'
					variant='document'
					purpose='verification-id'
					value={form.idCardUrl}
					onChange={(idCardUrl) => onChange({ idCardUrl })}
				/>
				<FileUploadCard
					label='Selfie com o documento'
					hint='Segura o documento ao lado do rosto'
					variant='selfie'
					purpose='verification-selfie'
					value={form.selfieUrl}
					onChange={(selfieUrl) => onChange({ selfieUrl })}
				/>
			</div>

			<div className='flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
				<div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white'>
					<CheckCircle2 className='size-4' aria-hidden />
				</div>
				<p className='text-sm leading-relaxed text-emerald-950'>
					Os documentos são confidenciais e só servem para verificar a
					tua identidade. Sem aprovação da equipe, a loja não fica
					pública no painel.
				</p>
			</div>

			{error && (
				<p
					role='alert'
					className='rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive'
				>
					{error}
				</p>
			)}
		</OnboardingShell>
	)
}
