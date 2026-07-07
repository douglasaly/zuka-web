'use client'

import { SearchIcon, SlidersHorizontal, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	SearchFiltersSheet,
	type FilterValues,
} from '@/modules/search/ui/components/search-filters-sheet'
import { cn } from '@/lib/utils'

export const SearchInput = () => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const query = searchParams.get('q') || ''
	const category = searchParams.get('categoria') || ''
	const province = searchParams.get('provincia') || ''
	const minPrice = searchParams.get('preco_min') || ''
	const maxPrice = searchParams.get('preco_max') || ''
	const isNew = searchParams.get('recente') || ''
	const sort = searchParams.get('ordenar') || 'relevance'
	const [value, setValue] = useState(query)

	const handleSearch = (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		const params = new URLSearchParams()
		const newQuery = value.trim()
		if (newQuery) params.set('q', newQuery)
		if (category) params.set('categoria', category)
		if (province) params.set('provincia', province)
		if (minPrice) params.set('preco_min', minPrice)
		if (maxPrice) params.set('preco_max', maxPrice)
		if (isNew === 'true') params.set('recente', 'true')
		if (sort && sort !== 'relevance') params.set('ordenar', sort)
		router.push(`/pesquisa?${params.toString()}`)
	}

	const handleApplyFilters = (values: FilterValues) => {
		const params = new URLSearchParams()
		if (value.trim()) params.set('q', value.trim())
		if (values.category && values.category !== 'all')
			params.set('categoria', values.category)
		if (values.province && values.province !== 'all')
			params.set('provincia', values.province)
		if (values.minPrice) params.set('preco_min', values.minPrice)
		if (values.maxPrice) params.set('preco_max', values.maxPrice)
		if (values.isNew === 'true') params.set('recente', 'true')
		if (values.sort && values.sort !== 'relevance')
			params.set('ordenar', values.sort)
		router.push(`/pesquisa?${params.toString()}`)
	}

	const handleClearFilters = () => {
		const params = new URLSearchParams()
		if (value.trim()) params.set('q', value.trim())
		router.push(`/pesquisa?${params.toString()}`)
	}

	const filterValues: FilterValues = {
		category,
		province,
		minPrice,
		maxPrice,
		isNew,
		sort,
	}

	return (
		<form className='relative w-full max-w-xl' onSubmit={handleSearch}>
			<SearchIcon className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground' />
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				type='search'
				placeholder='Procurar produtos, lojas, categorias...'
				className={cn(
					'h-11 rounded-full border border-border/80 bg-muted/30 pl-10 pr-20 shadow-none',
					'placeholder:text-muted-foreground/70',
					'focus-visible:bg-background focus-visible:ring-secondary/20'
				)}
			/>
			<div className='absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5'>
				{value && (
					<Button
						type='button'
						variant='ghost'
						size='icon-xs'
						onClick={() => setValue('')}
						className='rounded-full text-muted-foreground'
						aria-label='Limpar pesquisa'
					>
						<XIcon className='size-3.5' />
					</Button>
				)}
				<SearchFiltersSheet
					values={filterValues}
					onApply={handleApplyFilters}
					onClear={handleClearFilters}
					trigger={
						<Button
							type='button'
							variant='ghost'
							size='icon-xs'
							className='rounded-full text-muted-foreground'
							aria-label='Filtros'
						>
							<SlidersHorizontal className='size-3.5' />
						</Button>
					}
				/>
				<Button type='submit' size='sm' className='rounded-full px-3.5'>
					Buscar
				</Button>
			</div>
		</form>
	)
}
