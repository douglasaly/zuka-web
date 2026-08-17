import { SidebarProvider } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerDashboardSkeleton } from '../components/seller-dashboard-skeleton'
import { SellerSidebarSkeleton } from '../components/seller-sidebar-skeleton'
export const SellerTopBarSkeleton = () => (
	<header className='sticky top-0 z-30 flex h-19 min-w-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 px-4 sm:px-6'>
		<div className='flex min-w-0 items-center gap-2 sm:gap-3'>
			<Skeleton className='size-8 rounded-md md:hidden' />
			<div className='hidden min-w-0 md:block'>
				<Skeleton className='h-7 w-28' />
			</div>
		</div>
		<div className='flex shrink-0 items-center gap-2'>
			<Skeleton className='size-8 rounded-full' />
			<Skeleton className='hidden h-8 w-36 rounded-lg sm:block' />
		</div>
	</header>
)
export const SellerLayoutSkeleton = () => (
	<div className='flex min-h-screen w-full bg-background'>
		<SidebarProvider defaultOpen>
			<SellerSidebarSkeleton />
			<div className='flex min-h-screen min-w-0 flex-1 flex-col'>
				<SellerTopBarSkeleton />
				<main className='min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6'>
					<div className='min-w-0 max-w-full'>
						<SellerDashboardSkeleton />
					</div>
				</main>
			</div>
		</SidebarProvider>
	</div>
)
