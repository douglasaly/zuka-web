import type { Metadata } from 'next'
import { Suspense } from 'react'
import { pageMetadata } from '@/lib/seo/metadata'
import { ExploreView } from '@/modules/explore/ui/views/explore-view'

export const metadata: Metadata = pageMetadata({
	title: 'Explorar',
	description:
		'Explore produtos e lojas de vendedores locais em Moçambique no Zuka.',
	path: '/feed/explorar',
})

export default function ExplorePage() {
	return (
		<Suspense>
			<ExploreView />
		</Suspense>
	)
}
