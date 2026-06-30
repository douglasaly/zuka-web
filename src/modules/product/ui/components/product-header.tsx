import { Badge } from '@/components/ui/badge'

type ProductHeaderProps = {
	name: string
	isNew?: boolean
}

export const ProductHeader = ({ name, isNew }: ProductHeaderProps) => (
	<div className='flex items-start justify-between gap-3'>
		<h1 className='font-heading text-xl font-bold leading-tight md:text-2xl'>
			{name}
		</h1>
		{isNew && (
			<Badge variant='secondary' className='shrink-0'>
				Novo
			</Badge>
		)}
	</div>
)
