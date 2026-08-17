'use client'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	PERIOD_FILTERS,
	type PeriodFilter,
	STATUS_FILTERS,
	type StatusFilter,
} from '@/modules/orders/types'

type OrdersToolbarProps = {
	search: string
	onSearchChange: (value: string) => void
	status: StatusFilter
	onStatusChange: (value: StatusFilter) => void
	statusCounts: Record<StatusFilter, number>
	period: PeriodFilter
	onPeriodChange: (value: PeriodFilter) => void
	store: string
	onStoreChange: (value: string) => void
	stores: string[]
	showCounts?: boolean
}
export function OrdersToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	statusCounts,
	period,
	onPeriodChange,
	store,
	onStoreChange,
	stores,
	showCounts = false,
}: OrdersToolbarProps) {
	const periodItems = PERIOD_FILTERS.map((opt) => ({
		value: opt.value,
		label: opt.label,
	}))
	const storeItems = [
		{ value: 'all', label: 'Todas as lojas' },
		...stores.map((name) => ({ value: name, label: name })),
	]
	return (
		<div className='space-y-3 sm:space-y-4'>
			<div className='relative'>
				<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					type='search'
					placeholder='Pesquisar por nº, produto ou loja…'
					aria-label='Pesquisar pedidos'
					className='h-11 rounded-xl pl-9'
				/>
			</div>

			<div className='-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0'>
				<Tabs
					value={status}
					onValueChange={(value) => {
						if (typeof value === 'string') {
							onStatusChange(value as StatusFilter)
						}
					}}
					className='w-max min-w-full'
				>
					<TabsList
						variant='default'
						className='h-10 w-max min-w-full justify-start gap-0.5 rounded-xl p-1'
					>
						{STATUS_FILTERS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className='h-8 min-h-8 flex-none shrink-0 rounded-lg px-3 text-sm'
							>
								{tab.label}
								{showCounts ? (
									<span className='ml-1 tabular-nums opacity-70'>
										{statusCounts[tab.value]}
									</span>
								) : null}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5'>
				<Select
					items={periodItems}
					value={period}
					onValueChange={(v) => {
						if (v) onPeriodChange(v as PeriodFilter)
					}}
				>
					<SelectTrigger
						className='h-11 w-full rounded-xl'
						aria-label='Filtrar por período'
					>
						<SelectValue placeholder='Período' />
					</SelectTrigger>
					<SelectContent>
						{PERIOD_FILTERS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					items={storeItems}
					value={store}
					onValueChange={(v) => {
						if (v) onStoreChange(v)
					}}
				>
					<SelectTrigger
						className='h-11 w-full rounded-xl'
						aria-label='Filtrar por loja'
					>
						<SelectValue placeholder='Loja' />
					</SelectTrigger>
					<SelectContent>
						{storeItems.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
