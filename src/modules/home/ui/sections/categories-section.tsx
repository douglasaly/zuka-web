'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FilterCarousel } from '@/components/filter-carousel'
import { getCategories } from '@/lib/api/categories'

interface Props {
	categoryId?: string
}

export interface Categories {
	id: string
	parentId: any
	name: string
	slug: string
	createdAt: string
	updatedAt: string
	deletedAt: any
}

export const CategoriesSectionSuspense = ({ categoryId }: Props) => {
	const { data: categories = [] } = useQuery<Categories[]>({
		queryKey: ['categories'],
		queryFn: getCategories,
	})

	const router = useRouter()

	const data = categories.map(({ id, name }) => ({
		value: id,
		label: name,
	}))

	const onSelect = (value: string | null) => {
		const url = new URL('/feed/explorar', location.origin)

		const categorySlug = value
			? categories.find((c) => c.id === value)?.slug
			: undefined

		if (categorySlug) {
			url.searchParams.set('categoria', categorySlug)
		}

		router.push(`${url.pathname}${url.search}`)
	}

	return (
		<FilterCarousel
			isLoading={false}
			value={categoryId}
			data={data}
			onSelect={onSelect}
		/>
	)
}

export const CategoriesSection = ({ categoryId }: Props) => {
	return (
		<Suspense fallback={<CategorySkeleton />}>
			<ErrorBoundary
				fallback={
					<p className='text-sm text-muted-foreground'>
						Não foi possível carregar as categorias.
					</p>
				}
			>
				<CategoriesSectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	)
}

export const CategorySkeleton = () => {
	return <FilterCarousel isLoading data={[]} />
}
