import type { LucideIcon } from 'lucide-react'

type SettingsRowProps = {
	icon?: LucideIcon
	title: string
	description?: string
	right?: React.ReactNode
	onClick?: () => void
	destructive?: boolean
}

export const SettingsRow = ({
	icon: Icon,
	title,
	description,
	right,
	onClick,
	destructive = false,
}: SettingsRowProps) => {
	const Wrapper = onClick ? 'button' : 'div'

	return (
		<Wrapper
			type={onClick ? 'button' : undefined}
			onClick={onClick}
			className={`flex w-full items-center gap-3 border-b px-4 py-3.5 text-left last:border-b-0 ${
				onClick
					? 'transition-colors hover:bg-muted/40 cursor-pointer'
					: ''
			}`}
		>
			{Icon && (
				<Icon
					className={`size-5 shrink-0 ${
						destructive
							? 'text-destructive'
							: 'text-muted-foreground'
					}`}
				/>
			)}

			<div className='flex-1 min-w-0'>
				<p
					className={`text-sm font-medium ${
						destructive ? 'text-destructive' : ''
					}`}
				>
					{title}
				</p>
				{description && (
					<p className='text-xs text-muted-foreground'>
						{description}
					</p>
				)}
			</div>

			{right}
		</Wrapper>
	)
}
