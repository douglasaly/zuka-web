'use client'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { onboardingInputClass } from '@/modules/onboarding/ui/components/onboarding-form-card'

type PasswordInputFieldProps = {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	minLength?: number
	autoComplete?: string
	required?: boolean
	id?: string
}
export function PasswordInputField({
	value,
	onChange,
	placeholder,
	minLength,
	autoComplete = 'new-password',
	required,
	id,
}: PasswordInputFieldProps) {
	const [visible, setVisible] = useState(false)
	return (
		<div className='relative'>
			<Input
				id={id}
				type={visible ? 'text' : 'password'}
				required={required}
				minLength={minLength}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={cn(onboardingInputClass, 'pr-10')}
				autoComplete={autoComplete}
			/>
			<IconTooltipButton
				label={visible ? 'Ocultar senha' : 'Mostrar senha'}
				className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
				onClick={() => setVisible((v) => !v)}
			>
				{visible ? (
					<EyeOff className='size-4' />
				) : (
					<Eye className='size-4' />
				)}
			</IconTooltipButton>
		</div>
	)
}
