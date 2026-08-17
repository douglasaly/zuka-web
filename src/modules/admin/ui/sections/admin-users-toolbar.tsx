'use client'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type AdminUsersToolbarProps = {
	search: string
	onSearchChange: (value: string) => void
}
export function AdminUsersToolbar({
	search,
	onSearchChange,
}: AdminUsersToolbarProps) {
	return (
		<div className='relative flex-1 max-w-sm'>
			<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
			<Input
				value={search}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder='Pesquisar por nome ou email...'
				className='pl-9'
			/>
		</div>
	)
}
