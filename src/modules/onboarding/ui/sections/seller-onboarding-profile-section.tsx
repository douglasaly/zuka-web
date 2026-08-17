'use client'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { ProfileFormState } from '../../hooks/use-seller-onboarding'
import { FileUploadCard } from '../components/file-upload-card'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '../components/onboarding-form-card'
import { OnboardingShell } from '../components/onboarding-shell'
import { PhoneInput } from '../components/phone-input'

type SellerOnboardingProfileSectionProps = {
	form: ProfileFormState
	onChange: (patch: Partial<ProfileFormState>) => void
	descriptionError: string | null
	deliveryError: string | null
	whatsappError: string | null
	callPhoneError: string | null
	error: string | null
	isPending: boolean
	canContinue: boolean
	onBack: () => void
	onContinue: () => void
}
export function SellerOnboardingProfileSection({
	form,
	onChange,
	descriptionError,
	deliveryError,
	whatsappError,
	callPhoneError,
	error,
	isPending,
	canContinue,
	onBack,
	onContinue,
}: SellerOnboardingProfileSectionProps) {
	return (
		<OnboardingShell
			title='Perfil da loja'
			subtitle='Imagens e contacto ajudam os clientes a confiar e a falar contigo.'
			currentStep={2}
			onBack={onBack}
			footer={
				<Button
					type='button'
					className='h-12 w-full rounded-full text-base font-semibold'
					disabled={isPending || !canContinue}
					onClick={onContinue}
				>
					{isPending ? 'A guardar…' : 'Continuar'}
				</Button>
			}
		>
			<OnboardingFormCard
				title='Imagem da loja'
				description='Opcional por agora — podes actualizar depois.'
			>
				<FileUploadCard
					label='Logo da loja'
					hint='Preferência: imagem quadrada'
					variant='logo'
					purpose='store-logo'
					value={form.logoUrl}
					onChange={(logoUrl) => onChange({ logoUrl })}
				/>

				<FileUploadCard
					label='Banner da loja'
					hint='Imagem larga para o topo da página'
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
						placeholder='O que vendes e o que te distingue…'
						className={`${onboardingInputClass} min-h-24 resize-none`}
					/>
				</OnboardingField>
			</OnboardingFormCard>

			<OnboardingFormCard
				title='Contacto e entrega'
				description='Os clientes usam estes dados para WhatsApp e chamadas.'
			>
				<div className='flex items-center justify-between gap-4'>
					<div>
						<p className='text-sm font-semibold'>
							Ofereces entrega?
						</p>
						<p className='text-xs text-muted-foreground'>
							Mostra se fazes entrega ao domicílio
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
					label='WhatsApp'
					hint='Número móvel moçambicano (82–88)'
					optional={!form.hasDelivery}
					error={whatsappError}
				>
					<PhoneInput
						value={form.whatsapp}
						onChange={(whatsapp) => onChange({ whatsapp })}
					/>
				</OnboardingField>

				<OnboardingField
					label='Telefone para chamadas'
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
