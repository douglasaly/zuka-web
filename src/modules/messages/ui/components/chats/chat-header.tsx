'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { StoreAvatar } from '@/components/store-avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type ChatHeaderProps = {
	storeName: string
	storeAvatarUrl: string
	storeLocation: string
}

export const ChatHeader = ({
	storeName,
	storeAvatarUrl,
	storeLocation,
}: ChatHeaderProps) => {
	const router = useRouter()

	return (
		<div className='fixed left-0 right-0 top-0 z-50 flex items-center gap-2 border bg-white p-4 pt-6 md:left-72 md:right-8'>
			<Button
				className='hover:bg-secondary/40'
				variant='ghost'
				size='icon'
				aria-label='Voltar'
				onClick={() => router.back()}
			>
				<ArrowLeft className='size-5' />
			</Button>

			<Separator orientation='vertical' className='h-10 self-center' />

			<div className='flex flex-1 items-center gap-2'>
				<StoreAvatar
					imageUrl={storeAvatarUrl}
					name={storeName}
					size='lg'
				/>

				<div className='flex flex-col justify-center space-y-1'>
					<h3 className='text-md font-semibold leading-tight'>
						{storeName}
					</h3>
					<div className='line-clamp-1 text-xs leading-tight text-muted-foreground'>
						{storeLocation}
					</div>
				</div>
			</div>
		</div>
	)
}
