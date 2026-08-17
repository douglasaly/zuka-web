'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '@/modules/onboarding/ui/components/onboarding-form-card'
import { OnboardingShell } from '@/modules/onboarding/ui/components/onboarding-shell'
import type { BuyerFormState } from '../../constants'
import { PasswordInputField } from '../components/password-input-field'
import { SignupErrorAlert } from '../components/signup-error-alert'
import { SignupLoginPrompt } from '../components/signup-login-prompt'

type SignupBuyerFormSectionProps = {
	form: BuyerFormState
	onChange: (patch: Partial<BuyerFormState>) => void
	loading: boolean
	error: string | null
	onBack: () => void
	onContinue: () => void
}
export function SignupBuyerFormSection({
	form,
	onChange,
	loading,
	error,
	onBack,
	onContinue,
}: SignupBuyerFormSectionProps) {
	const canContinue = form.email.includes('@') && form.password.length >= 6
	return (
		<OnboardingShell
			title='Criar conta'
			subtitle='Preenche os teus dados para começar a comprar'
			onBack={onBack}
			footer={
				<div className='space-y-3'>
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={loading || !canContinue}
						onClick={onContinue}
					>
						{loading ? 'A criar conta...' : 'Continuar'}
					</Button>
					<SignupLoginPrompt />
				</div>
			}
		>
			<OnboardingFormCard>
				<OnboardingField label='Nome completo'>
					<Input
						type='text'
						value={form.name}
						onChange={(e) => onChange({ name: e.target.value })}
						placeholder='O teu nome'
						className={onboardingInputClass}
						autoComplete='name'
					/>
				</OnboardingField>

				<OnboardingField label='Email'>
					<Input
						type='email'
						required
						value={form.email}
						onChange={(e) => onChange({ email: e.target.value })}
						placeholder='exemplo@email.com'
						className={onboardingInputClass}
						autoComplete='email'
					/>
				</OnboardingField>

				<OnboardingField label='Senha'>
					<PasswordInputField
						required
						minLength={6}
						value={form.password}
						onChange={(password) => onChange({ password })}
						placeholder='Mínimo 6 caracteres'
					/>
				</OnboardingField>
			</OnboardingFormCard>

			<SignupErrorAlert error={error} />
		</OnboardingShell>
	)
}
