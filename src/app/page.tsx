import { queryClient } from '@/lib/query-client'
import { HomeView } from '@/modules/home/ui/components/home-view'
import { HydrateClient, trpc } from '@/trpc/server'

const Page = async () => {
	void queryClient.prefetchQuery(
		trpc.hello.getHello.queryOptions({
			text: 'Marvin Mussacate',
		})
	)
	return (
		<HydrateClient>
			<HomeView />
		</HydrateClient>
	)
}

export default Page
