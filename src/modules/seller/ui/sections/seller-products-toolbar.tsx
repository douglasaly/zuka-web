'use client'

import { FolderTree, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PER_PAGE_OPTIONS } from '@/modules/seller/ui/components/products/constants'

type SellerProductsToolbarProps = {
	rangeLabel: string
	isFetching: boolean
	isLoading: boolean
	perPage: number
	canCreate: boolean
	onPerPageChange: (value: string) => void
}

export function SellerProductsToolbar({
	rangeLabel,
	isFetching,
	isLoading,
	perPage,
	canCreate,
	onPerPageChange,
}: SellerProductsToolbarProps) {
	return (
		<div className='flex flex-wrap items-center justify-between gap-3'>
			<p className='text-sm text-muted-foreground'>
				{rangeLabel}
				{isFetching && !isLoading ? (
					<span className='ml-1 opacity-60'>· a actualizar…</span>
				) : null}
			</p>
			<div className='flex flex-wrap gap-2'>
				<Select
					value={String(perPage)}
					onValueChange={(v) => {
						if (!v) return
						onPerPageChange(v)
					}}
				>
					<SelectTrigger
						className='h-9 w-[7.5rem] rounded-full'
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
				<Button
					variant='outline'
					size='sm'
					className='rounded-full'
					render={
						<Link href='/dashboard/seller/produtos/categorias'>
							<FolderTree className='size-3.5' />
							Categorias
						</Link>
					}
				/>
				{canCreate ? (
					<Button
						className='rounded-full'
						render={
							<Link href='/dashboard/seller/produtos/novo'>
								<Plus className='size-4' />
								Novo produto
							</Link>
						}
					/>
				) : null}
			</div>
		</div>
	)
}
