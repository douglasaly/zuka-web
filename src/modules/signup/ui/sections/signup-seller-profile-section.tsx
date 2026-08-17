'use client'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
	isValidMzMobile,
	STORE_FORM_MESSAGES,
} from '@/lib/validations/store-form'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '@/modules/onboarding/ui/components/onboarding-form-card'
import { OnboardingShell } from '@/modules/onboarding/ui/components/onboarding-shell'
import { PhoneInput } from '@/modules/onboarding/ui/components/phone-input'
import type { SellerProfileFormState } from '../../constants'
import { SignupErrorAlert } from '../components/signup-error-alert'

type SignupSellerProfileSectionProps = {
	form: SellerProfileFormState
	onChange: (patch: Partial<SellerProfileFormState>) => void
	loading: boolean
	error: string | null
	onBack: () => void
	onContinue: () => void
}
export function SignupSellerProfileSection({
	form,
	onChange,
	loading,
	error,
	onBack,
	onContinue,
}: SignupSellerProfileSectionProps) {
	const descriptionOk = form.description.trim().length >= 20
	const whatsappOk = !form.whatsapp.trim() || isValidMzMobile(form.whatsapp)
	const callPhoneOk = !form.phone.trim() || isValidMzMobile(form.phone)
	const deliveryContactOk =
		!form.hasDelivery || Boolean(form.whatsapp.trim() || form.phone.trim())
	const canContinue =
		descriptionOk && whatsappOk && callPhoneOk && deliveryContactOk
	const descriptionError =
		form.description.length > 0 && !descriptionOk
			? STORE_FORM_MESSAGES.descriptionMin
			: null
	const deliveryError =
		form.hasDelivery && !deliveryContactOk
			? STORE_FORM_MESSAGES.deliveryContactRequired
			: null
	const whatsappError =
		form.whatsapp.length > 0 && !whatsappOk
			? STORE_FORM_MESSAGES.phoneInvalid
			: null
	const callPhoneError =
		form.phone.length > 0 && !callPhoneOk
			? STORE_FORM_MESSAGES.phoneInvalid
			: null
	return (
		<OnboardingShell
			title='Configura a tua loja'
			subtitle='Personaliza o perfil da tua loja'
			currentStep={2}
			onBack={onBack}
			footer={
				<Button
					type='button'
					className='h-12 w-full rounded-full text-base font-semibold'
					disabled={loading || !canContinue}
					onClick={onContinue}
				>
					{loading ? 'A guardar...' : 'Continuar'}
				</Button>
			}
		>
			<OnboardingFormCard>
				<FileUploadCard
					label='Logo da loja'
					hint='Carregar logo circular'
					variant='logo'
					purpose='store-logo'
					value={form.logoUrl}
					onChange={(logoUrl) => onChange({ logoUrl })}
				/>

				<FileUploadCard
					label='Banner da loja'
					hint='Carregar imagem de capa'
					variant='banner'
					purpose='store-banner'
					value={form.bannerUrl}
					onChange={(bannerUrl) => onChange({ bannerUrl })}
				/>

				<OnboardingField
					label='Descrição curta'
					hint='Mínimo de 20 caracteres'
					error={descriptionError}
				>
					<Textarea
						value={form.description}
						onChange={(e) =>
							onChange({ description: e.target.value })
						}
						placeholder='Descreve a tua loja em poucas palavras...'
						className={`${onboardingInputClass} min-h-24 resize-none`}
					/>
				</OnboardingField>
			</OnboardingFormCard>

			<OnboardingFormCard>
				<div className='flex items-center justify-between gap-4'>
					<div>
						<p className='text-sm font-semibold'>Fazes entregas?</p>
						<p className='text-xs text-muted-foreground'>
							Entrega ao domicílio
						</p>
					</div>
					<Switch
						checked={form.hasDelivery}
						onCheckedChange={(hasDelivery) =>
							onChange({ hasDelivery })
						}
					/>
				</div>

				{deliveryError ? (
					<p role='alert' className='text-xs text-destructive'>
						{deliveryError}
					</p>
				) : null}

				<OnboardingField
					label='Número WhatsApp'
					optional={!form.hasDelivery}
					error={whatsappError}
				>
					<PhoneInput
						value={form.whatsapp}
						onChange={(whatsapp) => onChange({ whatsapp })}
					/>
				</OnboardingField>

				<OnboardingField
					label='Número para chamadas'
					hint='Número móvel moçambicano (82–88)'
					optional={!form.hasDelivery}
					error={callPhoneError}
				>
					<PhoneInput
						value={form.phone}
						onChange={(phone) => onChange({ phone })}
					/>
				</OnboardingField>
			</OnboardingFormCard>

			<SignupErrorAlert error={error} />
		</OnboardingShell>
	)
}
