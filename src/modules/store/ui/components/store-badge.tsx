import { BadgeCheck } from 'lucide-react'

export const StoreVerifiedBadge = () => (
	<span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700'>
		<BadgeCheck className='size-3' />
		Verificada
	</span>
)
