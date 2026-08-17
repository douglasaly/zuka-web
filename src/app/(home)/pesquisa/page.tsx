import type { Metadata } from 'next'
import { Suspense } from 'react'
import { pageMetadata } from '@/lib/seo/metadata'
import { SearchSkeleton } from '@/modules/search/ui/components/search-skeleton'
import { SearchView } from '@/modules/search/ui/views/search-view'

interface SearchPageProps {
	searchParams: Promise<{
		q?: string
	}>
}

export async function generateMetadata({
	searchParams,
}: SearchPageProps): Promise<Metadata> {
	const { q } = await searchParams
	const query = q?.trim()

	if (query) {
		return pageMetadata({
			title: `Pesquisa: ${query}`,
			description: `Resultados de pesquisa para “${query}” no Zuka.`,
			path: `/pesquisa?q=${encodeURIComponent(query)}`,
			index: false,
			follow: true,
		})
	}

	return pageMetadata({
		title: 'Pesquisar',
		description:
			'Pesquise produtos, lojas e categorias no marketplace Zuka.',
		path: '/pesquisa',
		index: false,
		follow: true,
	})
}

export default function SearchPage() {
	return (
		<Suspense fallback={<SearchSkeleton />}>
			<SearchView />
		</Suspense>
	)
}
