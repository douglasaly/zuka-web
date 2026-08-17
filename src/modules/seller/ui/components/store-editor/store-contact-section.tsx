'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/modules/onboarding/ui/components/phone-input'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type StoreContactSectionProps = {
	form: StoreFormState
	onChange: (patch: Partial<StoreFormState>) => void
}
export function StoreContactSection({
	form,
	onChange,
}: StoreContactSectionProps) {
	return (
		<StoreSection
			title='Contactos'
			description='Como os clientes entram em contacto com a loja.'
		>
			<div className='grid gap-4 sm:grid-cols-2'>
				<div className='space-y-2'>
					<Label htmlFor='store-whatsapp'>WhatsApp</Label>
					<PhoneInput
						id='store-whatsapp'
						value={form.whatsapp}
						onChange={(whatsapp) => onChange({ whatsapp })}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='store-phone'>Telefone</Label>
					<PhoneInput
						id='store-phone'
						value={form.phone}
						onChange={(phone) => onChange({ phone })}
						placeholder='21 123 456'
					/>
				</div>
				<div className='min-w-0 space-y-2 sm:col-span-2'>
					<Label htmlFor='store-email'>Email da loja</Label>
					<Input
						id='store-email'
						type='email'
						value={form.email}
						onChange={(e) => onChange({ email: e.target.value })}
						placeholder='loja@exemplo.co.mz'
						className='h-11'
					/>
				</div>
			</div>
		</StoreSection>
	)
}
