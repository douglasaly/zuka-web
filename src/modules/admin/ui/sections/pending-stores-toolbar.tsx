type PendingStoresToolbarProps = {
	isLoading: boolean
	count: number
}

export function PendingStoresToolbar({
	isLoading,
	count,
}: PendingStoresToolbarProps) {
	return (
		<div className='flex items-center justify-between'>
			<p className='text-sm text-muted-foreground'>
				{isLoading
					? '…'
					: `${count} loja${count !== 1 ? 's' : ''} aguarda${count === 1 ? '' : 'm'} aprovação`}
			</p>
		</div>
	)
}
