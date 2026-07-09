import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'

export const ImageLightbox = ({
	src,
	alt,
	onClose,
}: {
	src: string
	alt: string
	onClose: () => void
}) => {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', handler)
		document.body.style.overflow = 'hidden'
		return () => {
			document.removeEventListener('keydown', handler)
			document.body.style.overflow = ''
		}
	}, [onClose])

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/90'
			onClick={onClose}
		>
			<Button
				variant='ghost'
				size='icon'
				className='absolute right-4 top-4 z-10 text-white/80 hover:text-white bg-secondary hover:bg-secondary/50'
				onClick={(e) => {
					e.stopPropagation()
					onClose()
				}}
				aria-label='Fechar'
			>
				<X className='size-6' />
			</Button>

			<div className='relative h-full w-full max-h-full max-w-full p-4 pointer-events-none'>
				<Image
					src={src}
					alt={alt}
					fill
					placeholder='blur'
					blurDataURL={BLUR_PLACEHOLDER}
					className='object-contain pointer-events-none'
				/>
			</div>
		</div>
	)
}
