import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
	formatMzMobileDisplay,
	normalizeMzDigits,
} from '@/lib/validations/store-form'

interface PhoneInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
	id?: string
}

export function PhoneInput({
	value,
	onChange,
	placeholder = '82 123 4567',
	className,
	id,
}: PhoneInputProps) {
	const display = formatMzMobileDisplay(value)

	return (
		<div
			className={cn(
				'flex overflow-hidden rounded-xl bg-muted',
				className
			)}
		>
			<div className='flex shrink-0 items-center gap-2 border-r border-border/60 px-3 py-2.5 text-sm text-muted-foreground'>
				<span className='text-base leading-none' aria-hidden>
					🇲🇿
				</span>
				<span className='font-medium text-foreground'>+258</span>
			</div>
			<Input
				id={id}
				type='tel'
				inputMode='numeric'
				autoComplete='tel-national'
				value={display}
				onChange={(e) => onChange(normalizeMzDigits(e.target.value))}
				placeholder={placeholder}
				maxLength={11}
				className='h-auto rounded-none border-0 bg-transparent px-3 py-2.5 shadow-none focus-visible:ring-0'
			/>
		</div>
	)
}
