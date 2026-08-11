'use client'

import { Search, X } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	DATE_OPTIONS,
	PER_PAGE_OPTIONS,
	STATUS_OPTIONS,
} from '../components/orders/constants'

type SellerOrdersToolbarProps = {
	searchInput: string
	onSearchChange: (value: string) => void
	statusFilter: string
	dateFilter: string
	perPage: number
	onStatusChange: (value: string) => void
	onDateChange: (value: string) => void
	onPerPageChange: (value: string) => void
	rangeLabel: string
}

export function SellerOrdersToolbar({
	searchInput,
	onSearchChange,
	statusFilter,
	dateFilter,
	perPage,
	onStatusChange,
	onDateChange,
	onPerPageChange,
	rangeLabel,
}: SellerOrdersToolbarProps) {
	return (
		<>
			<div className='flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
				<div className='relative min-w-0 flex-1 sm:max-w-md'>
					<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						value={searchInput}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder='Nº do pedido ou nome do cliente…'
						aria-label='Pesquisar pedidos'
						className='h-10 rounded-full border-border bg-background pr-10 pl-9'
					/>
					{searchInput ? (
						<span className='absolute top-1/2 right-1.5 -translate-y-1/2'>
							<IconTooltipButton
								label='Limpar pesquisa'
								className='size-8 text-muted-foreground'
								onClick={() => onSearchChange('')}
							>
								<X className='size-4' />
							</IconTooltipButton>
						</span>
					) : null}
				</div>
				<div className='flex flex-wrap gap-2'>
					<Select
						value={statusFilter}
						onValueChange={(v) => {
							if (v) onStatusChange(v)
						}}
					>
						<SelectTrigger className='h-10 w-full rounded-full sm:w-40'>
							<SelectValue placeholder='Estado' />
						</SelectTrigger>
						<SelectContent>
							{STATUS_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={dateFilter}
						onValueChange={(v) => {
							if (v) onDateChange(v)
						}}
					>
						<SelectTrigger className='h-10 w-full rounded-full sm:w-44'>
							<SelectValue placeholder='Período' />
						</SelectTrigger>
						<SelectContent>
							{DATE_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={String(perPage)}
						onValueChange={(v) => {
							if (v) onPerPageChange(v)
						}}
					>
						<SelectTrigger
							className='h-10 w-full rounded-full sm:w-36'
							aria-label='Itens por página'
						>
							<SelectValue placeholder='Por página' />
						</SelectTrigger>
						<SelectContent>
							{PER_PAGE_OPTIONS.map((n) => (
								<SelectItem key={n} value={String(n)}>
									{n} / página
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<p className='text-sm text-muted-foreground' aria-live='polite'>
				{rangeLabel}
			</p>
		</>
	)
}
