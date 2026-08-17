import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '../components/status-badge'

type StoreDetailHeaderProps = {
	store: Record<string, unknown>
}
export function StoreDetailHeader({ store }: StoreDetailHeaderProps) {
	return (
		<div className='flex items-center gap-3'>
			<Button
				render={
					<Link href='/admin/stores'>
						<ArrowLeft className='size-4' />
					</Link>
				}
				variant='ghost'
				size='sm'
			/>
			<div className='flex items-center gap-3'>
				{store.logo_url ? (
					<img
						src={store.logo_url as string}
						alt=''
						className='size-10 rounded-xl object-cover border border-border'
					/>
				) : (
					<div className='flex size-10 items-center justify-center rounded-xl bg-muted'>
						<ImageIcon className='size-5 text-muted-foreground' />
					</div>
				)}
				<div>
					<p className='font-heading font-bold'>
						{store.name as string}
					</p>
					<StatusBadge status={store.status as string} />
				</div>
			</div>
		</div>
	)
}
