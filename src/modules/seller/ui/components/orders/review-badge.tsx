'use client'
import { Badge } from '@/components/ui/badge'
import type { ReviewState } from './types'
export function ReviewBadge({ state }: { state: ReviewState }) {
	if (state === 'awaiting') {
		return (
			<Badge
				variant='secondary'
				className='bg-amber-500/10 text-amber-800 dark:text-amber-300'
			>
				Aguardando avaliação
			</Badge>
		)
	}
	if (state === 'done') {
		return (
			<Badge
				variant='secondary'
				className='bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
			>
				Avaliado
			</Badge>
		)
	}
	return null
}
