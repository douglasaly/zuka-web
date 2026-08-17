import { Suspense } from 'react'
import { SearchSkeleton } from '@/modules/search/ui/components/search-skeleton'
import { SearchView } from '@/modules/search/ui/views/search-view'
export const metadata = {
	title: 'Pesquisar — Zuka',
}
export default function SearchPage() {
	return (
		<Suspense fallback={<SearchSkeleton />}>
			<SearchView />
		</Suspense>
	)
}
