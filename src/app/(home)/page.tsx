import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site'
import { HomeView } from '@/modules/home/ui/views/home-view'

export const metadata: Metadata = {
	...pageMetadata({
		title: `${SITE_NAME} | Marketplace Multivendedor`,
		description: SITE_DESCRIPTION,
		path: '/',
	}),
	title: {
		absolute: `${SITE_NAME} | Marketplace Multivendedor`,
	},
}

const Page = async () => {
	return <HomeView />
}
export default Page
