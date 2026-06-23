'use client'

import { SearchIcon, SlidersHorizontal, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
		<form className='flex w-full pb-4' onSubmit={handleSearch}>
			<button
				type='submit'
				className='px-5 py-2.5 bg-gray-100 border border-l-0 rounded-l-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border-r-0 placeholder:-px-5 cursor-pointer'
			>
				<SearchIcon className='size-5 text-muted-foreground' />
			</button>

			<div className='relative w-full'>
				<input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					type='text'
					placeholder='Procurar produtos, lojas...'
					className='w-full h-14 pl-4 py-2 pr-12 border  focus:outline-none focus:border-blue-500 bg-gray-100 border-l-0 border-r-0  focus:border-l focus:border-r'
				/>

				{value && (
					<Button
						disabled={!value.trim()}
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setValue('')}
						className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full'
					>
						<XIcon className=' text-gray-500' />
					</Button>
				)}
			</div>
			<button
				type='submit'
				className='px-5 py-2.5 bg-gray-100 border border-r-0 rounded-r-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed border-l-0 placeholder:-px-5 cursor-pointer'
			>
				<SlidersHorizontal className='size-5 text-muted-foreground' />
			</button>
		</form>
	)
}
