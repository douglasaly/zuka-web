export function ChartCard({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card p-5'>
			<p className='mb-4 font-heading text-sm font-bold'>{title}</p>
			{children}
		</div>
	)
}
