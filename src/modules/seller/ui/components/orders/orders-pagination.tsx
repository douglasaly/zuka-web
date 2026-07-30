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
import { buildPageList } from './utils'

type OrdersPaginationProps = {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export function OrdersPagination({
	currentPage,
	totalPages,
	onPageChange,
}: OrdersPaginationProps) {
	const pageList = buildPageList(currentPage, totalPages)

	return (
		<div className='flex w-full flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between'>
			<p
				className='min-w-40 text-sm tabular-nums text-muted-foreground'
				aria-live='polite'
			>
				Página {currentPage} de {totalPages}
			</p>

			{/* Mobile: primeira / anterior / seguinte / última */}
			<div className='flex items-center justify-center gap-1.5 md:hidden'>
				<Button
					variant='outline'
					size='icon'
					className='rounded-full'
					disabled={currentPage <= 1}
					aria-label='Primeira página'
					onClick={() => onPageChange(1)}
				>
					<ChevronsLeft className='size-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='rounded-full'
					disabled={currentPage <= 1}
					aria-label='Página anterior'
					onClick={() => onPageChange(currentPage - 1)}
				>
					<ChevronLeft className='size-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='rounded-full'
					disabled={currentPage >= totalPages}
					aria-label='Página seguinte'
					onClick={() => onPageChange(currentPage + 1)}
				>
					<ChevronRight className='size-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='rounded-full'
					disabled={currentPage >= totalPages}
					aria-label='Última página'
					onClick={() => onPageChange(totalPages)}
				>
					<ChevronsRight className='size-4' />
				</Button>
			</div>

			{/* Desktop: primeira + anterior + números + seguinte + última */}
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
					<PaginationItem>
						<Button
							variant='ghost'
							size='default'
							className='gap-1 rounded-full pl-2'
							disabled={currentPage <= 1}
							aria-label='Ir para página anterior'
							onClick={() => onPageChange(currentPage - 1)}
						>
							<ChevronLeft className='size-4' />
							<span>Anterior</span>
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
							size='default'
							className='gap-1 rounded-full pr-2'
							disabled={currentPage >= totalPages}
							aria-label='Ir para página seguinte'
							onClick={() => onPageChange(currentPage + 1)}
						>
							<span>Próxima</span>
							<ChevronRight className='size-4' />
						</Button>
					</PaginationItem>
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
