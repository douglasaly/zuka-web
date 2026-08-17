import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: `${SITE_NAME} | Marketplace Multivendedor`,
		short_name: SITE_NAME,
		description: SITE_DESCRIPTION,
		start_url: '/',
		scope: '/',
		display: 'standalone',
		background_color: '#fafafa',
		theme_color: '#111111',
		lang: 'pt',
		icons: [
			{
				src: '/icon',
				sizes: '32x32',
				type: 'image/png',
			},
			{
				src: '/apple-icon',
				sizes: '180x180',
				type: 'image/png',
			},
		],
	}
}
