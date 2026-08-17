import type { ProductSeo, StoreSeo } from '@/lib/seo/queries'
import {
	absoluteUrl,
	getSiteUrl,
	SITE_DESCRIPTION,
	SITE_NAME,
} from '@/lib/seo/site'

export function siteGraphJsonLd() {
	const siteUrl = getSiteUrl()
	const organizationId = `${siteUrl}/#organization`
	const websiteId = `${siteUrl}/#website`

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': organizationId,
				name: SITE_NAME,
				url: siteUrl,
				description: SITE_DESCRIPTION,
				logo: absoluteUrl('/icon'),
				areaServed: {
					'@type': 'Country',
					name: 'Mozambique',
				},
			},
			{
				'@type': 'WebSite',
				'@id': websiteId,
				url: siteUrl,
				name: SITE_NAME,
				description: SITE_DESCRIPTION,
				inLanguage: 'pt',
				publisher: { '@id': organizationId },
				potentialAction: {
					'@type': 'SearchAction',
					target: {
						'@type': 'EntryPoint',
						urlTemplate: `${siteUrl}/pesquisa?q={search_term_string}`,
					},
					'query-input': 'required name=search_term_string',
				},
			},
		],
	}
}

export function productJsonLd(product: ProductSeo) {
	const url = absoluteUrl(`/product/${product.id}`)
	const price = product.discountPrice ?? product.price
	const offer = {
		'@type': 'Offer',
		url,
		priceCurrency: product.currency,
		price: String(price),
		availability: 'https://schema.org/InStock',
		itemCondition: 'https://schema.org/NewCondition',
		seller: product.storeName
			? {
					'@type': 'Organization',
					name: product.storeName,
					url: product.storeSlug
						? absoluteUrl(`/lojas/${product.storeSlug}`)
						: undefined,
				}
			: undefined,
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		description: product.description ?? undefined,
		image: product.imageUrls.length ? product.imageUrls : undefined,
		sku: product.id,
		url,
		brand: product.storeName
			? { '@type': 'Brand', name: product.storeName }
			: undefined,
		category: product.categoryName ?? undefined,
		offers: offer,
		aggregateRating:
			product.ratingCount > 0
				? {
						'@type': 'AggregateRating',
						ratingValue: product.ratingAvg.toFixed(1),
						reviewCount: product.ratingCount,
						bestRating: '5',
						worstRating: '1',
					}
				: undefined,
	}
}

export function storeJsonLd(store: StoreSeo) {
	const url = absoluteUrl(`/lojas/${store.slug}`)
	return {
		'@context': 'https://schema.org',
		'@type': 'Store',
		name: store.name,
		description: store.description ?? undefined,
		url,
		image: store.bannerUrl || store.logoUrl || undefined,
		logo: store.logoUrl ?? undefined,
		address: {
			'@type': 'PostalAddress',
			addressCountry: 'MZ',
			addressRegion: store.province ?? undefined,
			addressLocality: store.neighborhood ?? undefined,
		},
		aggregateRating:
			store.ratingCount > 0
				? {
						'@type': 'AggregateRating',
						ratingValue: store.ratingAvg.toFixed(1),
						reviewCount: store.ratingCount,
						bestRating: '5',
						worstRating: '1',
					}
				: undefined,
	}
}
