'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
	AccountFormState,
	Category,
	Province,
} from '../../hooks/use-seller-onboarding'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '../components/onboarding-form-card'
import { OnboardingShell } from '../components/onboarding-shell'
import { PhoneInput } from '../components/phone-input'

type SellerOnboardingAccountSectionProps = {
	form: AccountFormState
	onChange: (patch: Partial<AccountFormState>) => void
	provinces: Province[]
	categories: Category[]
	emailError: string | null
	phoneError: string | null
	error: string | null
	isPending: boolean
	canContinue: boolean
	onBack: () => void
	onContinue: () => void
}

export function SellerOnboardingAccountSection({
	form,
	onChange,
	provinces,
	categories,
	emailError,
	phoneError,
	error,
	isPending,
	canContinue,
	onBack,
	onContinue,
}: SellerOnboardingAccountSectionProps) {
	return (
		<OnboardingShell
			title='Dados da tua loja'
			subtitle='Começa com o essencial. Podes editar tudo depois no painel.'
			currentStep={1}
			onBack={onBack}
			backLabel='Voltar ao marketplace'
			footer={
				<Button
					type='button'
					className='h-12 w-full rounded-full text-base font-semibold'
					disabled={isPending || !canContinue}
					onClick={onContinue}
				>
					{isPending ? 'A criar a loja…' : 'Continuar'}
				</Button>
			}
		>
			<OnboardingFormCard>
				<OnboardingField
					label='Nome da loja'
					hint='Como os clientes vão encontrar-te no Zuka'
				>
					<Input
						required
						value={form.name}
						onChange={(e) => onChange({ name: e.target.value })}
						placeholder='Ex: Loja da Fátima'
						className={onboardingInputClass}
					/>
				</OnboardingField>

				<OnboardingField
					label='Cidade / Bairro'
					hint='Ajuda os clientes a perceber onde estás'
				>
					<Input
						required
						value={form.neighborhood}
						onChange={(e) =>
							onChange({ neighborhood: e.target.value })
						}
						placeholder='Ex: Maputo, Baixa'
						className={onboardingInputClass}
					/>
				</OnboardingField>

				<OnboardingField label='Email' error={emailError}>
					<Input
						type='email'
						required
						value={form.email}
						onChange={(e) => onChange({ email: e.target.value })}
						placeholder='exemplo@email.com'
						className={onboardingInputClass}
					/>
				</OnboardingField>

				<OnboardingField label='Categoria principal'>
					<select
						required
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
