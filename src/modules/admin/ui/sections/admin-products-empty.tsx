'use client'

import { Package } from 'lucide-react'
import { EmptyState } from '@/modules/admin/ui/components/empty-state'

type AdminProductsEmptyProps = {
	hasFilters: boolean
}

export function AdminProductsEmpty({ hasFilters }: AdminProductsEmptyProps) {
	return (
		<EmptyState
			icon={Package}
			message={
				hasFilters
					? 'Nenhum produto corresponde aos filtros.'
					: 'Nenhum produto encontrado.'
			}
		/>
	)
}
