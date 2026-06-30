import { Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import type { SellerProduct } from '../../constants'

type SellerProductRowProps = {
	product: SellerProduct
	onEdit: (id: string) => void
	onDelete: () => void // <- sem parâmetro
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
				sizes='64px'
				className='object-cover'
			/>
		</div>

		<div className='flex-1 min-w-0'>
			<h3 className='font-semibold leading-tight'>{product.name}</h3>
			<p className='mt-1 font-bold'>{product.price}</p>
		</div>

		<div className='flex shrink-0 gap-2'>
			<Button
				variant='ghost'
				size='icon'
				className='size-10 rounded-full bg-muted/60 hover:bg-muted'
				aria-label='Editar produto'
				onClick={() => onEdit(product.id)}
			>
				<Pencil className='size-4' />
			</Button>
			<Button
				variant='ghost'
				size='icon'
				className='size-10 rounded-full bg-muted/60 hover:bg-muted'
				aria-label='Eliminar produto'
				onClick={onDelete}
			>
				<Trash2 className='size-4 text-red-600' />
			</Button>
		</div>
	</div>
)
