import { Grid2x2, Logs } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '../../../../components/product-card'

const products = [
	{
		id: '1',
		name: 'Jeans Premium Slim Fit',
		price: 150000,
		discountPrice: 120000,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '2',
		name: 'Smartphone Samsung Galaxy A15',
		price: 180000,
		discountPrice: null,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '3',
		name: 'T-Shirt Oversized Streetwear',
		price: 45000,
		discountPrice: 35000,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '4',
		name: 'Nike Air Force 1',
		price: 250000,
		discountPrice: 220000,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '5',
		name: 'Laptop Dell Inspiron 15',
		price: 850000,
		discountPrice: null,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '6',
		name: 'Headphones Bluetooth JBL',
		price: 95000,
		discountPrice: 75000,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '7',
		name: 'Relógio Smart Watch Pro',
		price: 120000,
		discountPrice: 99000,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
	{
		id: '8',
		name: 'Mochila Casual Impermeável',
		price: 60000,
		discountPrice: null,
		currency: 'MZN',
		isVisible: true,
		status: 'ACTIVE',
		image: '/product-placeholder.jpg',
	},
]

export default function ProductsSection() {
	return (
		<div className='w-full flex flex-col gap-4 space-y-2 pt-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='font-semibold text-xl'>Novidades</h1>
				</div>
				<div className='flex justify-center items-center gap-4'>
					<Button
						variant='ghost'
						size='icon'
						className='size-5 cursor-pointer'
						type='button'
					>
						<Grid2x2 className='size-5 mr-2' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						className='size-5 cursor-pointer'
						type='button'
					>
						<Logs className='size-5 mr-2' />
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{products.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</div>
	)
}
