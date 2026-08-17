'use client'
export function SettingsBand({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children: React.ReactNode
}) {
	return (
		<section className='min-w-0 space-y-3'>
			<div className='min-w-0 px-0.5'>
				<h2 className='font-heading text-base font-semibold tracking-tight'>
					{title}
				</h2>
				{description ? (
					<p className='mt-1 text-sm text-muted-foreground'>
						{description}
					</p>
				) : null}
			</div>
			<div className='min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
				<div className='divide-y divide-border/50'>{children}</div>
			</div>
		</section>
	)
}
