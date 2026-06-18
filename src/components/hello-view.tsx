'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'
import { Button } from './ui/button'

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
			<pre>{JSON.stringify(data?.greeting)}</pre>

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
