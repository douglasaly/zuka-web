export function UserDetailRow({
	label,
	value,
	children,
}: {
	label: string
	value?: string | null
	children?: React.ReactNode
}) {
	if (!value && !children) return null
	return (
		<div className='flex items-center gap-3 px-4 py-2.5'>
			<span className='w-28 shrink-0 text-xs text-muted-foreground'>
				{label}
			</span>
			{children ?? <span className='text-sm font-medium'>{value}</span>}
		</div>
	)
}
