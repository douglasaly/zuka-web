'use client'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'
import { OnboardingShell } from '@/modules/onboarding/ui/components/onboarding-shell'
import type { SellerVerificationFormState } from '../../constants'
import { SignupErrorAlert } from '../components/signup-error-alert'

type SignupSellerVerificationSectionProps = {
	form: SellerVerificationFormState
	onChange: (patch: Partial<SellerVerificationFormState>) => void
	loading: boolean
	error: string | null
	onBack: () => void
	onSubmit: () => void
}
export function SignupSellerVerificationSection({
	form,
	onChange,
	loading,
	error,
	onBack,
	onSubmit,
}: SignupSellerVerificationSectionProps) {
	const canSubmit = Boolean(form.idCardUrl && form.selfieUrl)
	return (
		<OnboardingShell
			title='Verificação de identidade'
			subtitle='Precisamos verificar a tua identidade. A tua conta será aprovada em até 24 horas.'
			currentStep={3}
			onBack={onBack}
			maxWidth='lg'
			footer={
				<Button
					type='button'
					className='h-12 w-full rounded-full text-base font-semibold'
					disabled={loading || !canSubmit}
					onClick={onSubmit}
				>
					{loading ? 'A enviar...' : 'Enviar para revisão'}
				</Button>
			}
		>
			<div className='grid gap-4 sm:grid-cols-2'>
				<FileUploadCard
					label=''
					hint=''
					variant='document'
					purpose='verification-id'
					value={form.idCardUrl}
					onChange={(idCardUrl) => onChange({ idCardUrl })}
				/>
				<FileUploadCard
					label=''
					hint=''
					variant='selfie'
					purpose='verification-selfie'
					value={form.selfieUrl}
					onChange={(selfieUrl) => onChange({ selfieUrl })}
				/>
			</div>

			<div className='flex items-start gap-3 rounded-2xl bg-emerald-50 p-4'>
				<div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
					<CheckCircle2 className='size-4' />
				</div>
				<p className='text-sm leading-relaxed text-emerald-900'>
					Os teus documentos são tratados de forma confidencial e
					segura. Só são usados para verificar a tua identidade.
				</p>
			</div>

			<SignupErrorAlert error={error} />
		</OnboardingShell>
	)
}
