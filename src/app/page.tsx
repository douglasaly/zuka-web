import HomeView from '@/modules/home/ui/components/home-view'
import { HydrateClient } from '@/trpc/server'

const Page = async () => {
	
	return (
		<HydrateClient>
			<HomeView />
		</HydrateClient>
	)
}

export default Page
