import { Loader2 } from 'lucide-react'

export function AddressesLoading() {
	return (
		<div className='flex items-center justify-center py-16'>
			<Loader2 className='size-6 animate-spin text-muted-foreground' />
		</div>
	)
}
