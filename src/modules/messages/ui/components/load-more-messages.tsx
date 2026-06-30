'use client'

import { Button } from '@/components/ui/button'

type LoadMoreMessagesProps = {
	onLoadMore: () => void
	isLoading?: boolean
}

export const LoadMoreMessages = ({
	onLoadMore,
	isLoading = false,
}: LoadMoreMessagesProps) => (
	<div className='flex justify-center pt-2'>
		<Button
			variant='ghost'
			size='sm'
			onClick={onLoadMore}
			disabled={isLoading}
			className='text-xs text-secondary hover:text-secondary/80'
		>
			{isLoading ? 'A carregar...' : 'Carregar mais mensagens'}
		</Button>
	</div>
)
