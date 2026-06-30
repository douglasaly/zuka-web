type SettingsSectionProps = {
	title: string
	description?: string
	children: React.ReactNode
}

export const SettingsSection = ({
	title,
	description,
	children,
}: SettingsSectionProps) => (
	<section className='space-y-3'>
		<div>
			<h2 className='text-base font-semibold'>{title}</h2>
			{description && (
				<p className='text-sm text-muted-foreground'>{description}</p>
			)}
		</div>

		<div className='overflow-hidden rounded-xl border bg-card'>
			{children}
		</div>
	</section>
)
