'use client'
import { Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	isValidMzMobile,
	isValidStoreEmail,
	STORE_FORM_MESSAGES,
} from '@/lib/validations/store-form'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '@/modules/onboarding/ui/components/onboarding-form-card'
import { OnboardingShell } from '@/modules/onboarding/ui/components/onboarding-shell'
import { PhoneInput } from '@/modules/onboarding/ui/components/phone-input'
import type {
	SellerAccountFormState,
	SignupCategory,
	SignupProvince,
} from '../../constants'
import { PasswordInputField } from '../components/password-input-field'
import { SignupErrorAlert } from '../components/signup-error-alert'
import { SignupLoginPrompt } from '../components/signup-login-prompt'

type SignupSellerAccountSectionProps = {
	form: SellerAccountFormState
	onChange: (patch: Partial<SellerAccountFormState>) => void
	provinces: SignupProvince[]
	categories: SignupCategory[]
	locationLoading: boolean
	locationError: string | null
	onRequestLocation: () => void
	loading: boolean
	error: string | null
	onBack: () => void
	onContinue: () => void
}
export function SignupSellerAccountSection({
	form,
	onChange,
	provinces,
	categories,
	locationLoading,
	locationError,
	onRequestLocation,
	loading,
	error,
	onBack,
	onContinue,
}: SignupSellerAccountSectionProps) {
	const emailOk = isValidStoreEmail(form.email)
	const passwordOk = form.password.length >= 8
	const confirmOk =
		form.confirmPassword.length > 0 &&
		form.password === form.confirmPassword
	const phoneOk = isValidMzMobile(form.phone)
	const canContinue = Boolean(
		form.storeName.trim() &&
			form.neighborhood.trim() &&
			emailOk &&
			passwordOk &&
			confirmOk &&
			phoneOk &&
			form.provinceId
	)
	const passwordError =
		form.password.length > 0 && !passwordOk
			? STORE_FORM_MESSAGES.passwordMin
			: null
	const confirmError =
		form.confirmPassword.length > 0 && !confirmOk
			? STORE_FORM_MESSAGES.passwordMismatch
			: null
	const emailError =
		form.email.trim().length > 0 && !emailOk
			? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
				? STORE_FORM_MESSAGES.emailPlaceholder
				: STORE_FORM_MESSAGES.emailInvalid
			: null
	const phoneError =
		form.phone.length > 0 && !phoneOk
			? STORE_FORM_MESSAGES.phoneInvalid
			: null
	return (
		<OnboardingShell
			title='Criar conta de loja'
			subtitle='Preenche os dados da tua loja'
			currentStep={1}
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
				<OnboardingField label='Nome da loja'>
					<Input
						required
						value={form.storeName}
						onChange={(e) =>
							onChange({ storeName: e.target.value })
						}
						placeholder='Ex: Loja da Fátima'
						className={onboardingInputClass}
					/>
				</OnboardingField>

				<OnboardingField label='Província'>
					<select
						required
						value={form.provinceId}
						onChange={(e) =>
							onChange({ provinceId: e.target.value })
						}
						className={`${onboardingInputClass} w-full text-sm`}
					>
						<option value=''>Selecionar província</option>
						{provinces.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
				</OnboardingField>

				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-sm font-semibold'>
							Endereço da loja
						</span>
						<button
							type='button'
							disabled={locationLoading}
							onClick={onRequestLocation}
							className='inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline disabled:opacity-60'
						>
							{locationLoading ? (
								<Loader2 className='size-3 animate-spin' />
							) : (
								<MapPin className='size-3' />
							)}
							{locationLoading
								? 'A obter...'
								: 'Usar localização atual'}
						</button>
					</div>
					<Input
						required
						value={form.neighborhood}
						onChange={(e) =>
							onChange({ neighborhood: e.target.value })
						}
						placeholder='Ex: Av. Eduardo Mondlane, Maputo'
						className={onboardingInputClass}
					/>
					{locationError && (
						<p className='text-xs text-destructive'>
							{locationError}
						</p>
					)}
				</div>

				<OnboardingField label='Email' error={emailError}>
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

				<OnboardingField
					label='Palavra-passe'
					hint='Mínimo de 8 caracteres'
					error={passwordError}
				>
					<PasswordInputField
						required
						minLength={8}
						value={form.password}
						onChange={(password) => onChange({ password })}
						placeholder='Mínimo de 8 caracteres'
					/>
				</OnboardingField>

				<OnboardingField
					label='Confirmar Palavra-passe'
					error={confirmError}
				>
					<PasswordInputField
						required
						minLength={8}
						value={form.confirmPassword}
						onChange={(confirmPassword) =>
							onChange({ confirmPassword })
						}
						placeholder='Repete a palavra-passe'
					/>
				</OnboardingField>

				<OnboardingField label='Categoria principal'>
					<select
						value={form.categoryId}
						onChange={(e) =>
							onChange({ categoryId: e.target.value })
						}
						className={`${onboardingInputClass} w-full text-sm`}
					>
						<option value=''>Selecionar categoria</option>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</OnboardingField>

				<OnboardingField
					label='Número de Celular'
					hint='Formato +258 seguido de 9 dígitos (82–88)'
					error={phoneError}
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
