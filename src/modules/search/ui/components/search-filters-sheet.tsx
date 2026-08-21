'use client'
import { useQuery } from '@tanstack/react-query'
import {
	ArrowUpDown,
	CalendarClock,
	FilterX,
	ListFilter,
	MapPin,
	Tag,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/use-media-query'
import { getCategories } from '@/lib/api/categories'
import { getProvinces } from '@/lib/api/provinces'
import type { FilterValues } from '@/types'

type SearchFiltersSheetProps = {
	values: FilterValues
	onApply: (values: FilterValues) => void
	onClear: () => void
	trigger?: React.ReactElement
	triggerLabel?: string
}
const SORT_OPTIONS = [
	{ value: 'relevance', label: 'Relevância' },
	{ value: 'price_asc', label: 'Preço: menor para maior' },
	{ value: 'price_desc', label: 'Preço: maior para menor' },
	{ value: 'newest', label: 'Mais recentes' },
]
export function SearchFiltersSheet(props: SearchFiltersSheetProps) {
	const [mounted, setMounted] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [open, setOpen] = useState(false)
	const triggerLabel = props.triggerLabel ?? 'Filtros'
	useEffect(() => {
		setMounted(true)
	}, [])
	const handleApply = (values: FilterValues) => {
		props.onApply(values)
		setOpen(false)
	}
	const handleClear = () => {
		props.onClear()
		setOpen(false)
	}
	if (!mounted) {
		return props.trigger ?? null
	}
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<Tooltip>
					<TooltipTrigger
						render={<DialogTrigger render={props.trigger} />}
					/>
					<TooltipContent side='bottom'>
						{triggerLabel}
					</TooltipContent>
				</Tooltip>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Filtros</DialogTitle>
						<DialogDescription>
							Refina os resultados da pesquisa
						</DialogDescription>
					</DialogHeader>
					<FiltersContent
						values={props.values}
						onApply={handleApply}
						onClear={handleClear}
					/>
				</DialogContent>
			</Dialog>
		)
	}
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger
					render={<SheetTrigger render={props.trigger} />}
				/>
				<TooltipContent side='bottom'>{triggerLabel}</TooltipContent>
			</Tooltip>
			<SheetContent side='bottom' className='rounded-t-2xl'>
				<SheetHeader className='text-left'>
					<SheetTitle>Filtros</SheetTitle>
					<SheetDescription>
						Refina os resultados da pesquisa
					</SheetDescription>
				</SheetHeader>
				<div className='mt-4 max-h-[70vh] overflow-y-auto px-4 pb-6'>
					<FiltersContent
						values={props.values}
						onApply={handleApply}
						onClear={handleClear}
					/>
				</div>
			</SheetContent>
		</Sheet>
	)
}
function FiltersContent({
	values,
	onApply,
	onClear,
}: {
	values: FilterValues
	onApply: (values: FilterValues) => void
	onClear: () => void
}) {
	const { data: categories = [] } = useQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	})
	const { data: provinces = [] } = useQuery({
		queryKey: ['provinces'],
		queryFn: getProvinces,
	})
	const [category, setCategory] = useState(values.category)
	const [province, setProvince] = useState(values.province)
	const [minPrice, setMinPrice] = useState(values.minPrice)
	const [maxPrice, setMaxPrice] = useState(values.maxPrice)
	const [isNew, setIsNew] = useState(values.isNew === 'true')
	const [sort, setSort] = useState(values.sort)
	const hasActiveFilters =
		values.category ||
		values.province ||
		values.minPrice ||
		values.maxPrice ||
		values.isNew === 'true' ||
		values.sort !== 'relevance'
	const activeFilterCount = [
		values.category,
		values.province,
		values.minPrice || values.maxPrice,
		values.isNew === 'true',
		values.sort !== 'relevance',
	].filter(Boolean).length
	return (
		<div className='flex flex-col gap-5'>
			<div className='space-y-2'>
				<div className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
					<Tag className='size-3.5 text-muted-foreground' />
					<Label className='text-sm font-medium cursor-pointer'>
						Categoria
					</Label>
					{values.category && (
						<span className='ml-auto text-xs text-secondary'>
							• activo
						</span>
					)}
				</div>
				<Select
					value={category}
					onValueChange={(v) => setCategory(v ?? 'all')}
				>
					<SelectTrigger>
						<SelectValue placeholder='Todas as categorias' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as categorias</SelectItem>
						{categories.map((c: any) => (
							<SelectItem key={c.id} value={c.slug}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Separator />

			<div className='space-y-2'>
				<div className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
					<MapPin className='size-3.5 text-muted-foreground' />
					<Label className='text-sm font-medium cursor-pointer'>
						Província
					</Label>
					{values.province && (
						<span className='ml-auto text-xs text-secondary'>
							• activo
						</span>
					)}
				</div>
				<Select
					value={province}
					onValueChange={(v) => setProvince(v ?? 'all')}
				>
					<SelectTrigger>
						<SelectValue placeholder='Todas as províncias' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as províncias</SelectItem>
						{(
							provinces as Array<{
								id: string
								name: string
								slug: string
							}>
						).map((p) => (
							<SelectItem key={p.id} value={p.slug}>
								{p.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Separator />

			<div className='space-y-2'>
				<div className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
					<span className='text-muted-foreground text-xs'>MZN</span>
					<Label className='text-sm font-medium cursor-pointer'>
						Faixa de preço
					</Label>
					{(values.minPrice || values.maxPrice) && (
						<span className='ml-auto text-xs text-secondary'>
							• activo
						</span>
					)}
				</div>
				<div className='flex items-center gap-2'>
					<Input
						type='number'
						placeholder='Mín'
						value={minPrice}
						onChange={(e) => setMinPrice(e.target.value)}
						min={0}
					/>
					<span className='text-muted-foreground'>a</span>
					<Input
						type='number'
						placeholder='Máx'
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
						min={0}
					/>
				</div>
			</div>

			<Separator />

			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
					<CalendarClock className='size-3.5 text-muted-foreground' />
					<Label
						htmlFor='is-new-filter'
						className='text-sm font-medium cursor-pointer'
					>
						Produtos recentes
					</Label>
					{values.isNew === 'true' && (
						<span className='ml-2 text-xs text-secondary'>
							• activo
						</span>
					)}
				</div>
				<Switch
					id='is-new-filter'
					checked={isNew}
					onCheckedChange={setIsNew}
				/>
			</div>

			<Separator />

			<div className='space-y-2'>
				<div className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
					<ArrowUpDown className='size-3.5 text-muted-foreground' />
					<Label className='text-sm font-medium cursor-pointer'>
						Ordenar por
					</Label>
					{values.sort !== 'relevance' && (
						<span className='ml-auto text-xs text-secondary'>
							• activo
						</span>
					)}
				</div>
				<Select
					value={sort}
					onValueChange={(v) => setSort(v ?? 'relevance')}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Separator />

			<div className='flex items-center gap-3 pt-1'>
				<Button variant='outline' className='flex-1' onClick={onClear}>
					<FilterX className='mr-1.5 size-4' />
					Limpar
				</Button>
				<Button
					className='flex-1'
					onClick={() =>
						onApply({
							category,
							minPrice,
							maxPrice,
							sort,
							province,
							isNew: isNew ? 'true' : '',
						})
					}
				>
					<ListFilter className='mr-1.5 size-4' />
					Aplicar
				</Button>
			</div>

			{hasActiveFilters && (
				<div className='flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
					<span className='inline-flex size-5 items-center justify-center rounded-full bg-secondary/10 text-[10px] font-medium text-secondary'>
						{activeFilterCount}
					</span>
					<span>
						filtro{activeFilterCount !== 1 ? 's' : ''} activo
						{activeFilterCount !== 1 ? 's' : ''}
					</span>
				</div>
			)}
		</div>
	)
}
