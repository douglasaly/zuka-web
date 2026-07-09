export default function DashboardLoading() {
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<div className='flex flex-col items-center gap-4'>
				<div className='size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground' />
				<p className='text-sm text-muted-foreground'>A carregar…</p>
			</div>
		</div>
	)
}
