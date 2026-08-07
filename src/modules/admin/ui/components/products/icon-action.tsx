'use client'

import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function IconAction({
	label,
	onClick,
	className,
	destructive,
	children,
}: {
	label: string
	onClick: () => void
	className?: string
	destructive?: boolean
	children: React.ReactNode
}) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button
						type='button'
						variant='ghost'
						size='icon-sm'
						aria-label={label}
						className={cn(
							destructive &&
								'text-destructive hover:bg-destructive/10 hover:text-destructive',
							className
						)}
						onClick={onClick}
					>
						{children}
					</Button>
				}
			/>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	)
}
