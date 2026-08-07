import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Image as ImageIcon } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '../components/status-badge'

type StoreDetailProductsProps = {
	products: Record<string, unknown>[]
}

export function StoreDetailProducts({ products }: StoreDetailProductsProps) {
	return (
		<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Produto</TableHead>
						<TableHead>Categoria</TableHead>
						<TableHead>Preço</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Criado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map((p) => {
						const imgs = p.product_images as Record<
							string,
							unknown
						>[]
						const primary = imgs?.find((i) => i.is_primary)
							?.url as string
						return (
							<TableRow key={p.id as string}>
								<TableCell>
									<div className='flex items-center gap-2'>
										{primary ? (
											<img
												src={primary}
												alt=''
												className='size-8 rounded-md object-cover border border-border'
											/>
										) : (
											<div className='flex size-8 items-center justify-center rounded-md bg-muted'>
												<ImageIcon className='size-4 text-muted-foreground' />
											</div>
										)}
										<span className='text-sm font-medium'>
											{p.name as string}
										</span>
									</div>
								</TableCell>
								<TableCell className='text-muted-foreground'>
									{((p.categories as Record<string, unknown>)
										?.name as string) ?? '—'}
								</TableCell>
								<TableCell className='font-medium'>
									{p.price
										? `${(p.currency as string) ?? 'MZN'} ${Number(p.price).toLocaleString('pt-PT')}`
										: '—'}
								</TableCell>
								<TableCell>
									<StatusBadge
										status={
											p.is_visible
												? 'ACTIVE'
												: 'SUSPENDED'
										}
									/>
								</TableCell>
								<TableCell className='text-xs text-muted-foreground'>
									{p.created_at
										? format(
												new Date(
													p.created_at as string
												),
												'd MMM yyyy',
												{ locale: pt }
											)
										: '—'}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
