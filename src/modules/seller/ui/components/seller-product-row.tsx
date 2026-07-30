import { Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { SellerProduct } from '../../constants'
import { IconTooltipButton } from './icon-tooltip-button'

type SellerProductRowProps = {
	product: SellerProduct
	onEdit: (id: string) => void
	onDelete: () => void
}

export const SellerProductRow = ({
	product,
	onEdit,
	onDelete,
}: SellerProductRowProps) => (
	<div className='flex items-center gap-4 rounded-2xl border bg-white p-4'>
		<div className='relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted'>
			<Image
				src={product.imageUrl}
				alt={product.name}
				fill
				placeholder='blur'
				blurDataURL={BLUR_PLACEHOLDER}
				sizes='64px'
				className='object-cover'
			/>
		</div>

		<div className='min-w-0 flex-1'>
			<h3 className='font-semibold leading-tight'>{product.name}</h3>
			<p className='mt-1 font-bold'>{product.price}</p>
		</div>

		<div className='flex shrink-0 gap-2'>
			<IconTooltipButton
				label='Editar produto'
				size='icon'
				className='size-10 bg-muted/60 hover:bg-muted'
				onClick={() => onEdit(product.id)}
			>
				<Pencil className='size-4' />
			</IconTooltipButton>
			<IconTooltipButton
				label='Eliminar produto'
				size='icon'
				className='size-10 bg-muted/60 hover:bg-muted'
				onClick={onDelete}
			>
				<Trash2 className='size-4 text-red-600' />
			</IconTooltipButton>
		</div>
	</div>
)
