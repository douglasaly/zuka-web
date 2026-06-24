'use client'

import { SearchIcon, SlidersHorizontal, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const SearchInput = () => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const query = searchParams.get('query') || ''
	const categoryId = searchParams.get('categoryId') || ''
	const [value, setValue] = useState(query)

	const handleSearch = (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()

		const url = new URL(
			'/search',
			`${process.env.VERCEL_URL || 'http://localhost:3000'}`
		)

		const newQuery = value.trim()

		url.searchParams.set('query', encodeURIComponent(newQuery))

		if (categoryId) {
			url.searchParams.set('categoryId', categoryId)
		}

		if (newQuery === '') {
			url.searchParams.delete('query')
		}

		setValue(newQuery)
		router.push(url.toString())
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
				<Button
					type='button'
					variant='ghost'
					size='icon-xs'
					className='rounded-full text-muted-foreground'
					aria-label='Filtros'
				>
					<SlidersHorizontal className='size-3.5' />
				</Button>
				<Button type='submit' size='sm' className='rounded-full px-3.5'>
					Buscar
				</Button>
			</div>
		</form>
	)
}
