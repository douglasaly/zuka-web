'use client'
import Link from 'next/link'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type IconTooltipButtonProps = {
	label: string
	children: ReactNode
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void
	href?: string
	disabled?: boolean
	type?: 'button' | 'submit'
	variant?: ComponentProps<typeof Button>['variant']
	size?: 'icon' | 'icon-sm' | 'icon-xs' | 'icon-lg'
	className?: string
	side?: 'top' | 'bottom' | 'left' | 'right'
	'aria-pressed'?: boolean
}
export function IconTooltipButton({
	label,
	children,
	onClick,
	href,
	disabled,
	type = 'button',
	variant = 'ghost',
	size = 'icon-sm',
	className,
	side = 'top',
	'aria-pressed': ariaPressed,
}: IconTooltipButtonProps) {
	const button = (
		<Button
			type={type}
			variant={variant}
			size={size}
			className={cn('rounded-full', className)}
			aria-label={label}
			aria-pressed={ariaPressed}
			onClick={onClick}
			disabled={disabled}
			render={href ? <Link href={href} /> : undefined}
		>
			{children}
		</Button>
	)
	return (
		<Tooltip>
			<TooltipTrigger render={button} />
			<TooltipContent side={side}>{label}</TooltipContent>
		</Tooltip>
	)
}
