'use client'

type SellerOrderDetailBuyerProps = {
	buyer: {
		name: string
		email: string | null
		phone: string | null
	}
}

export function SellerOrderDetailBuyer({ buyer }: SellerOrderDetailBuyerProps) {
	return (
		<section className='rounded-xl border border-border bg-card p-5'>
			<p className='text-xs font-medium text-muted-foreground'>Cliente</p>
			<p className='mt-1 font-heading font-semibold'>{buyer.name}</p>
			{buyer.email ? (
				<p className='text-sm text-muted-foreground'>{buyer.email}</p>
			) : null}
			{buyer.phone ? (
				<p className='text-sm text-muted-foreground'>{buyer.phone}</p>
			) : null}
		</section>
	)
}
