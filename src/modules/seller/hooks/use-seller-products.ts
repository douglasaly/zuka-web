'use client'

import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from 'react'
import { toast } from 'sonner'
import type { SellerProduct } from '@/lib/types/api/seller'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'
import { parsePerPage } from '@/modules/seller/ui/components/orders/utils'
import {
	DEFAULT_PER_PAGE,
	PER_PAGE_OPTIONS,
	type ProductsResponse,
} from '@/modules/seller/ui/components/products/constants'

export function useSellerProducts() {
	const [deletingId, setDeletingId] = useState<string | null>(null)
	const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
	const [preview, setPreview] = useState<SellerProduct | null>(null)
	const [previewImage, setPreviewImage] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const deferredSearch = useDeferredValue(search.trim())
	const [statusFilter, setStatusFilter] = useState('all')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [showPriceFilters, setShowPriceFilters] = useState(false)
	const [selected, setSelected] = useState<Set<string>>(new Set())
	const queryClient = useQueryClient()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [, startTransition] = useTransition()
	const { can } = useSellerAccess()
	const canCreate = can('product.create')
	const canUpdate = can('product.update')
	const canDelete = can('product.delete')

	const page = Math.max(Number(searchParams.get('page')) || 1, 1)
	const perPage = parsePerPage(searchParams.get('perPage'), {
		defaultPerPage: DEFAULT_PER_PAGE,
		perPageOptions: PER_PAGE_OPTIONS,
	})

	function replaceParams(
		patch: Record<string, string | null>,
		options?: { resetPage?: boolean }
	) {
		const next = new URLSearchParams(searchParams.toString())
		for (const [key, value] of Object.entries(patch)) {
			if (value == null || value === '' || value === 'all') {
				next.delete(key)
			} else {
				next.set(key, value)
			}
		}
		if (options?.resetPage) next.delete('page')
		if (next.get('perPage') === String(DEFAULT_PER_PAGE)) {
			next.delete('perPage')
		}
		const qs = next.toString()
		startTransition(() => {
			router.replace(qs ? `${pathname}?${qs}` : pathname, {
				scroll: false,
			})
		})
	}

	function resetPage() {
		if (page > 1) replaceParams({}, { resetPage: true })
	}

	const apiParams = useMemo(() => {
		const p = new URLSearchParams()
		p.set('page', String(page))
		p.set('perPage', String(perPage))
		if (statusFilter !== 'all') p.set('status', statusFilter)
		if (categoryFilter !== 'all') p.set('category', categoryFilter)
		if (deferredSearch) p.set('search', deferredSearch)
		if (minPrice) p.set('minPrice', minPrice)
		if (maxPrice) p.set('maxPrice', maxPrice)
		return p.toString()
	}, [
		page,
		perPage,
		statusFilter,
		categoryFilter,
		deferredSearch,
		minPrice,
		maxPrice,
	])

	const { data, isLoading, isFetching } = useQuery<ProductsResponse>({
		queryKey: ['seller-products', apiParams],
		queryFn: async () => {
			const res = await fetch(`/api/seller/products?${apiParams}`)
			if (!res.ok) throw new Error('Failed to load products')
			return res.json()
		},
		placeholderData: keepPreviousData,
	})

	const { data: categories } = useQuery<{ id: string; name: string }[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) return []
			const json = await res.json()
			const items = (json.data ?? json) as Array<Record<string, unknown>>
			if (!Array.isArray(items)) return []
			return items.map((row) => ({
				id: String(row.id),
				name: String(row.name),
			}))
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/seller/products/${id}`, {
				method: 'DELETE',
			})
			if (!res.ok) throw new Error('Failed to delete product')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			setDeletingId(null)
			if (preview?.id === deletingId) setPreview(null)
			toast.success('Produto eliminado')
		},
		onError: () => toast.error('Erro ao eliminar produto'),
	})

	const bulkMutation = useMutation({
		mutationFn: async (action: 'delete' | 'activate' | 'deactivate') => {
			const res = await fetch('/api/seller/products/bulk', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, ids: Array.from(selected) }),
			})
			if (!res.ok) throw new Error('Bulk action failed')
			return action
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ['seller-products'] })
			setSelected(new Set())
			setConfirmBulkDelete(false)
			toast.success(
				action === 'delete'
					? 'Produtos eliminados'
					: action === 'activate'
						? 'Produtos activados'
						: 'Produtos pausados'
			)
		},
		onError: () => toast.error('Erro na acção em massa'),
	})

	const products = data?.products ?? []
	const total = data?.total ?? products.length
	const totalPages = data?.totalPages ?? 1
	const currentPage = data?.page ?? page
	const deletingProduct = products.find((p) => p.id === deletingId) ?? null
	const allSelected = products.length > 0 && selected.size === products.length
	const rangeStart = total === 0 ? 0 : (currentPage - 1) * perPage + 1
	const rangeEnd = Math.min(currentPage * perPage, total)
	const showPager = total > 0

	const rangeLabel =
		total === 0
			? 'Nenhum produto encontrado'
			: `Mostrando ${rangeStart}–${rangeEnd} de ${total} ${total === 1 ? 'produto' : 'produtos'}`

	const hasFilters =
		Boolean(deferredSearch) ||
		statusFilter !== 'all' ||
		categoryFilter !== 'all' ||
		Boolean(minPrice) ||
		Boolean(maxPrice)

	function goToPage(nextPage: number) {
		if (nextPage < 1 || nextPage > totalPages) return
		replaceParams({
			page: nextPage <= 1 ? null : String(nextPage),
			perPage: perPage === DEFAULT_PER_PAGE ? null : String(perPage),
		})
	}

	const prevSearch = useRef(deferredSearch)
	// biome-ignore lint/correctness/useExhaustiveDependencies: only react to search changes
	useEffect(() => {
		if (prevSearch.current === deferredSearch) return
		prevSearch.current = deferredSearch
		if (page > 1) {
			replaceParams({}, { resetPage: true })
		}
	}, [deferredSearch])

	function toggleAll() {
		if (allSelected) setSelected(new Set())
		else setSelected(new Set(products.map((p) => p.id)))
	}

	function toggleOne(id: string) {
		const next = new Set(selected)
		if (next.has(id)) next.delete(id)
		else next.add(id)
		setSelected(next)
	}

	function clearFilters() {
		setSearch('')
		setStatusFilter('all')
		setCategoryFilter('all')
		setMinPrice('')
		setMaxPrice('')
		setShowPriceFilters(false)
		resetPage()
	}

	function handleStatusChange(value: string) {
		setStatusFilter(value)
		resetPage()
	}

	function handleCategoryChange(value: string) {
		setCategoryFilter(value)
		resetPage()
	}

	function handleMinPriceChange(value: string) {
		setMinPrice(value)
		resetPage()
	}

	function handleMaxPriceChange(value: string) {
		setMaxPrice(value)
		resetPage()
	}

	function handlePerPageChange(value: string) {
		replaceParams(
			{
				perPage: value === String(DEFAULT_PER_PAGE) ? null : value,
			},
			{ resetPage: true }
		)
	}

	function openPreview(product: SellerProduct) {
		setPreview(product)
		setPreviewImage(product.image)
	}

	function closePreview() {
		setPreview(null)
		setPreviewImage(null)
	}

	return {
		canCreate,
		canUpdate,
		canDelete,

		search,
		setSearch,
		statusFilter,
		categoryFilter,
		minPrice,
		maxPrice,
		showPriceFilters,
		setShowPriceFilters,
		perPage,
		goToPage,
		clearFilters,
		hasFilters,
		handleStatusChange,
		handleCategoryChange,
		handleMinPriceChange,
		handleMaxPriceChange,
		handlePerPageChange,

		products,
		categories: categories ?? [],
		totalPages,
		currentPage,
		rangeLabel,
		showPager,
		isLoading,
		isFetching,

		selected,
		setSelected,
		allSelected,
		toggleAll,
		toggleOne,

		deletingId,
		setDeletingId,
		deletingProduct,
		confirmBulkDelete,
		setConfirmBulkDelete,
		deleteMutation,
		bulkMutation,

		preview,
		previewImage,
		setPreviewImage,
		openPreview,
		closePreview,
	}
}
