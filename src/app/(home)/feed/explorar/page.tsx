import { Suspense } from 'react'
import { ExploreView } from '@/modules/explore/ui/views/explore-view'

export default function ExplorePage() {
	return (
		<Suspense>
			<ExploreView />
		</Suspense>
	)
}
