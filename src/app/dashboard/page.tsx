import HelloView from '@/components/hello-view'
import { queryClient } from '@/lib/query-client'
import { HydrateClient, trpc } from '@/trpc/server'

const Page = () => {
	void queryClient.prefetchQuery(
		trpc.hello.getHello.queryOptions({
			text: 'Marvin Mussacate',
		})
	)

	return (
		<HydrateClient>
			<HelloView />
		</HydrateClient>
	)
}

export default Page
