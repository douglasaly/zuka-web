'use client'

import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { Button } from './ui/button'
import { toast } from 'sonner'

const HelloView = () => {
	const trpc = useTRPC()

	const { data } = useQuery(
		trpc.hello.getHello.queryOptions({
			text: 'Marvin Mussacate',
		})
	)
	function onClick() {
		toast.success('Hello')
	}

	return (
		<div>
			<p>{JSON.stringify(data?.greeting)}</p>
			<Button
				variant='ghost'
				className='border-2 border-gray-600 hover:bg-gray-500 hover:text-zinc-50 cursor-pointer'
				onClick={onClick}
			>
				Click
			</Button>
		</div>
	)
}

export default HelloView
