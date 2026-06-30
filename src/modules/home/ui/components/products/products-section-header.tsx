import { ArrowRight, LayoutGrid, List } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { type ViewMode, ViewModeToggle } from '@/components/view-mode-toggle'
import { cn } from '@/lib/utils'

export type ProductsViewMode = 'grid' | 'list'

type ProductsSectionHeaderProps = {
	viewMode: ViewMode
	onViewModeChange: (mode: ViewMode) => void
}

export const ProductsSectionHeader = ({
	viewMode,
	onViewModeChange,
}: ProductsSectionHeaderProps) => (
	<div className='flex items-end justify-between gap-4'>
		<div className='space-y-1'>
			<h2 className='font-heading text-xl font-bold tracking-tight md:text-2xl'>
				Novidades
			</h2>
			<p className='text-sm text-muted-foreground'>
				Os produtos mais recentes dos nossos vendedores
			</p>
		</div>

		<div className='flex items-center gap-1'>
			<ViewModeToggle value={viewMode} onChange={onViewModeChange} />
			<Button
				render={<Link href='/feed/explorar' />}
				variant='ghost'
				size='sm'
				className={cn('ml-1 hidden text-secondary sm:inline-flex')}
			>
				Ver todos
				<ArrowRight className='size-3.5' />
			</Button>
		</div>
	</div>
)
