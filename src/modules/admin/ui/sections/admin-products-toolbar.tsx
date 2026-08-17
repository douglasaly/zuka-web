'use client'
type AdminProductsToolbarProps = {
	productCount: number
	isLoading: boolean
	isFetching: boolean
}
export function AdminProductsToolbar({
	productCount,
	isLoading,
	isFetching,
}: AdminProductsToolbarProps) {
	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
			<div>
				<p className='text-sm text-muted-foreground'>
					Moderar anúncios do marketplace
					{!isLoading ? (
						<>
							{' '}
							·{' '}
							<span className='tabular-nums text-foreground'>
								{productCount}
							</span>{' '}
							{productCount === 1 ? 'produto' : 'produtos'}
							{isFetching ? '…' : ''}
						</>
					) : null}
				</p>
			</div>
		</div>
	)
}
