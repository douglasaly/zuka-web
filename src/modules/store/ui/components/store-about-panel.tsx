type StoreAboutPanelProps = {
	about?: string | null
}

export const StoreAboutPanel = ({ about }: StoreAboutPanelProps) => (
	<div className='rounded-2xl border border-border/60 bg-card p-5'>
		<p className='text-sm leading-relaxed text-muted-foreground'>
			{about || 'Sem descrição disponível.'}
		</p>
	</div>
)
