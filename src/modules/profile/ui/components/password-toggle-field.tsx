'use client'
import { Eye, EyeOff } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Input } from '@/components/ui/input'

type PasswordToggleFieldProps = {
	id: string
	value: string
	onChange: (value: string) => void
	visible: boolean
	onToggleVisible: () => void
	autoComplete?: string
	minLength?: number
	required?: boolean
	placeholder?: string
}
export function PasswordToggleField({
	id,
	value,
	onChange,
	visible,
	onToggleVisible,
	autoComplete,
	minLength,
	required,
	placeholder = '••••••••',
}: PasswordToggleFieldProps) {
	return (
		<div className='relative'>
			<Input
				id={id}
				type={visible ? 'text' : 'password'}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				autoComplete={autoComplete}
				minLength={minLength}
				required={required}
			/>
			<IconTooltipButton
				label={visible ? 'Esconder' : 'Mostrar'}
				className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground'
				onClick={onToggleVisible}
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
