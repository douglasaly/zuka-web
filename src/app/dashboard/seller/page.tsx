import Link from 'next/link'
import { SellerDashboardView } from '@/modules/seller/ui/views/seller-dashboard-view'

export default function SellerDashboardPage() {
	return (
		<div className='min-h-screen bg-background'>
			<header className='border-b border-border/60 bg-background/80 backdrop-blur-xl'>
				<div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6'>
					<Link href='/' className='flex items-center gap-2'>
						<div className='flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground'>
							Z
						</div>
						<span className='font-heading font-bold'>Zuka Vendedor</span>
					</Link>
					<Link
						href='/feed/explorar'
						className='text-sm font-medium text-muted-foreground hover:text-secondary'
					>
						Voltar ao marketplace
					</Link>
				</div>
			</header>
			<SellerDashboardView />
		</div>
	)
}
