'use client'

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from '@/components/ui/pagination'

function buildPageList(
	current: number,
	total: number
): Array<number | 'ellipsis'> {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}
	const pages = new Set<number>([1, total, current])
	for (let i = current - 1; i <= current + 1; i++) {
		if (i > 1 && i < total) pages.add(i)
	}
	const sorted = [...pages].sort((a, b) => a - b)
	const result: Array<number | 'ellipsis'> = []
	for (let i = 0; i < sorted.length; i++) {
		const page = sorted[i]!
		if (i > 0 && page - sorted[i - 1]! > 1) result.push('ellipsis')
		result.push(page)
	}
	return result
}

type ReviewsPaginationProps = {
	currentPage: number
	totalPages: number
	total: number
	perPage: number
	onPageChange: (page: number) => void
}

export function ReviewsPagination({
	currentPage,
	totalPages,
	total,
	perPage,
	onPageChange,
}: ReviewsPaginationProps) {
	if (totalPages <= 1) return null

	const from = (currentPage - 1) * perPage + 1
	const to = Math.min(currentPage * perPage, total)
	const pageList = buildPageList(currentPage, totalPages)

	return (
		<div className='flex w-full flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between'>
			<p
				className='text-sm tabular-nums text-muted-foreground'
				aria-live='polite'
			>
				A mostrar {from}–{to} de {total}
			</p>

			<div className='flex items-center justify-center gap-1.5 md:hidden'>
				<Button
					variant='outline'
					size='icon'
					className='size-10 rounded-full'
					disabled={currentPage <= 1}
					aria-label='Primeira página'
					onClick={() => onPageChange(1)}
				>
					<ChevronsLeft className='size-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='size-10 rounded-full'
					disabled={currentPage <= 1}
					aria-label='Página anterior'
					onClick={() => onPageChange(currentPage - 1)}
				>
					<ChevronLeft className='size-4' />
				</Button>
				<span className='min-w-16 text-center text-sm tabular-nums'>
					{currentPage}/{totalPages}
				</span>
				<Button
					variant='outline'
					size='icon'
					className='size-10 rounded-full'
					disabled={currentPage >= totalPages}
					aria-label='Página seguinte'
					onClick={() => onPageChange(currentPage + 1)}
				>
					<ChevronRight className='size-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='size-10 rounded-full'
					disabled={currentPage >= totalPages}
					aria-label='Última página'
					onClick={() => onPageChange(totalPages)}
				>
					<ChevronsRight className='size-4' />
				</Button>
			</div>

			<Pagination className='hidden justify-end md:flex'>
				<PaginationContent>
					<PaginationItem>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full'
							disabled={currentPage <= 1}
							aria-label='Ir para a primeira página'
							onClick={() => onPageChange(1)}
						>
							<ChevronsLeft className='size-4' />
						</Button>
					</PaginationItem>
					{pageList.map((item, idx) =>
						item === 'ellipsis' ? (
							<PaginationItem key={`e-${idx}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={item}>
								<Button
									variant={
										item === currentPage
											? 'outline'
											: 'ghost'
									}
									size='icon'
									className='rounded-full'
									aria-label={`Ir para página ${item}`}
									aria-current={
										item === currentPage
											? 'page'
											: undefined
									}
									onClick={() => onPageChange(item)}
								>
									{item}
								</Button>
							</PaginationItem>
						)
					)}
					<PaginationItem>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full'
							disabled={currentPage >= totalPages}
							aria-label='Ir para a última página'
							onClick={() => onPageChange(totalPages)}
						>
							<ChevronsRight className='size-4' />
						</Button>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	)
}
