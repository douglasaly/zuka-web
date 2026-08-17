'use client'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { STATUS_OPTIONS } from '@/modules/admin/hooks/use-all-stores'

type AllStoresFiltersProps = {
	search: string
	onSearchChange: (value: string) => void
	status: string
	onStatusChange: (value: string) => void
}
export function AllStoresFilters({
	search,
	onSearchChange,
	status,
	onStatusChange,
}: AllStoresFiltersProps) {
	return (
		<div className='flex flex-wrap items-center gap-3'>
			<div className='relative flex-1 min-w-48'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder='Pesquisar por nome...'
					className='pl-9'
				/>
			</div>
			<div className='flex gap-1'>
				{STATUS_OPTIONS.map((opt) => (
					<button
						key={opt.value}
						type='button'
						onClick={() => onStatusChange(opt.value)}
						className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${status === opt.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'}`}
					>
						{opt.label}
					</button>
				))}
			</div>
		</div>
	)
}
