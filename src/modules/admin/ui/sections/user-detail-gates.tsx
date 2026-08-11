import { Skeleton } from '@/components/ui/skeleton'

export function UserDetailLoading() {
	return (
		<div className='space-y-6'>
			<Skeleton className='h-8 w-48' />
			<Skeleton className='h-64 rounded-2xl' />
		</div>
	)
}

export function UserDetailNotFound() {
	return <p className='text-muted-foreground'>Utilizador não encontrado.</p>
}
