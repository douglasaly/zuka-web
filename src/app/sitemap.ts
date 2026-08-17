import type { MetadataRoute } from 'next'
import { getSitemapCatalog } from '@/lib/seo/queries'
import { absoluteUrl } from '@/lib/seo/site'

export const revalidate = 3600

const STATIC_ROUTES = [
	{ path: '/', changeFrequency: 'daily' as const, priority: 1 },
	{
		path: '/feed/explorar',
		changeFrequency: 'daily' as const,
		priority: 0.9,
	},
	{
		path: '/perguntas-frequentes',
		changeFrequency: 'monthly' as const,
		priority: 0.5,
	},
	{
		path: '/termos-e-condicoes',
		changeFrequency: 'yearly' as const,
		priority: 0.3,
	},
	{ path: '/privacidade', changeFrequency: 'yearly' as const, priority: 0.3 },
	{ path: '/auth/login', changeFrequency: 'monthly' as const, priority: 0.4 },
	{ path: '/signup', changeFrequency: 'monthly' as const, priority: 0.4 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const catalog = await getSitemapCatalog()
	const now = new Date()

	return [
		...STATIC_ROUTES.map((page) => ({
			url: absoluteUrl(page.path),
			lastModified: now,
			changeFrequency: page.changeFrequency,
			priority: page.priority,
		})),
		...catalog.categories.map((entry) => ({
			url: absoluteUrl(entry.path),
			lastModified: now,
			changeFrequency: 'weekly' as const,
			priority: 0.6,
		})),
		...catalog.stores.map((entry) => ({
			url: absoluteUrl(entry.path),
			lastModified: entry.lastModified,
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		})),
		...catalog.products.map((entry) => ({
			url: absoluteUrl(entry.path),
			lastModified: entry.lastModified,
			changeFrequency: 'daily' as const,
			priority: 0.8,
		})),
	]
}
