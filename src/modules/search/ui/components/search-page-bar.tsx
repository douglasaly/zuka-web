'use client'

import { SearchIcon, SlidersHorizontal, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchPageBarProps = {
	initialQuery: string
	onFilterClick: () => void
}

export function SearchPageBar({
	initialQuery,
	onFilterClick,
}: SearchPageBarProps) {
	const router = useRouter()
	const [value, setValue] = useState(initialQuery)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const params = new URLSearchParams(window.location.search)
		params.set('q', value.trim())
		if (!value.trim()) params.delete('q')
		router.push(`/pesquisa?${params.toString()}`)
	}

	const handleClear = () => {
		setValue('')
		const params = new URLSearchParams(window.location.search)
		params.delete('q')
		router.push(`/pesquisa?${params.toString()}`)
	}

	return (
		<form onSubmit={handleSubmit} className='relative w-full max-w-2xl'>
			<SearchIcon className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground' />
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				type='search'
				placeholder='Procurar produtos, lojas, categorias...'
				className={cn(
					'h-12 rounded-xl border pl-11 pr-24 text-base shadow-none',
					'focus-visible:ring-secondary/20'
				)}
				autoFocus
			/>
			<div className='absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5'>
				{value && (
					<Button
						type='button'
						variant='ghost'
						size='icon-xs'
						onClick={handleClear}
						className='rounded-full text-muted-foreground'
						aria-label='Limpar pesquisa'
					>
						<XIcon className='size-4' />
					</Button>
				)}
				<Button
					type='button'
					variant='ghost'
					size='icon-xs'
					onClick={onFilterClick}
					className='rounded-full text-muted-foreground'
					aria-label='Filtros'
				>
					<SlidersHorizontal className='size-4' />
				</Button>
				<Button type='submit' size='sm' className='rounded-lg px-4'>
					Buscar
				</Button>
			</div>
		</form>
	)
}
