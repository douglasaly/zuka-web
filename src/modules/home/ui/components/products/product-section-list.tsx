import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ProductsViewMode } from './products-section-header'

type ProductsSectionSkeletonProps = {
	viewMode: ProductsViewMode
}

export const ProductsSectionSkeleton = ({
	viewMode,
}: ProductsSectionSkeletonProps) => (
	<div
		className={cn(
			viewMode === 'grid'
				? 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'
				: 'flex flex-col gap-3'
		)}
	>
		{Array.from({ length: 8 }).map((_, i) =>
			viewMode === 'grid' ? (
				<div key={i} className='space-y-2'>
					<Skeleton className='aspect-4/5 w-full rounded-2xl' />
					<Skeleton className='h-4 w-full rounded-md' />
					<Skeleton className='h-4 w-1/2 rounded-md' />
				</div>
			) : (
				<div
					key={i}
					className='flex items-center gap-3 rounded-2xl border p-3'
				>
					<Skeleton className='size-16 shrink-0 rounded-xl' />
					<div className='flex-1 space-y-2'>
						<Skeleton className='h-4 w-2/3 rounded-md' />
						<Skeleton className='h-4 w-1/3 rounded-md' />
					</div>
				</div>
			)
		)}
	</div>
)
