'use client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { StoreAvatar } from '@/components/store-avatar'
import { Separator } from '@/components/ui/separator'

type ChatHeaderProps = {
	storeName: string
	storeAvatarUrl: string
	storeLocation: string
	storeSlug: string
}
export const ChatHeader = ({
	storeName,
	storeAvatarUrl,
	storeLocation,
	storeSlug,
}: ChatHeaderProps) => {
	const router = useRouter()
	return (
		<div className='fixed left-0 right-0 top-0 z-50 flex items-center gap-2 border bg-white p-4 pt-6 md:left-72 md:right-8'>
			<IconTooltipButton
				label='Voltar'
				size='icon'
				className='hover:bg-secondary/40'
				onClick={() => router.back()}
			>
				<ArrowLeft className='size-5' />
			</IconTooltipButton>

			<Separator orientation='vertical' className='h-10 self-center' />

			<div className='flex flex-1 items-center gap-2'>
				<StoreAvatar
					imageUrl={storeAvatarUrl}
					name={storeName}
					size='lg'
				/>

				<div className='flex flex-col justify-center space-y-1'>
					<Link
						href={`/lojas/${storeSlug}`}
						prefetch
						className='text-md font-semibold leading-tight hover:underline'
					>
						{storeName}
					</Link>
					<div className='line-clamp-1 text-xs leading-tight text-muted-foreground'>
						{storeLocation}
					</div>
				</div>
			</div>
		</div>
	)
}
