export function StoreDetailInfoCard({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
			<p className='border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
				{title}
			</p>
			<div className='divide-y divide-border/40'>{children}</div>
		</div>
	)
}
export function StoreDetailInfoRow({
	label,
	value,
}: {
	label: string
	value?: string | null
}) {
	if (!value) return null
	return (
		<div className='flex items-start gap-3 px-4 py-2.5'>
			<span className='w-28 shrink-0 text-xs text-muted-foreground'>
				{label}
			</span>
			<span className='break-words text-xs font-medium'>{value}</span>
		</div>
	)
}
