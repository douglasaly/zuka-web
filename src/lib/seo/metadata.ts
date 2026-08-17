import type { Metadata } from 'next'
import { absoluteUrl, SITE_NAME, truncateText } from '@/lib/seo/site'

export const noIndexRobots: Metadata['robots'] = {
	index: false,
	follow: false,
	googleBot: {
		index: false,
		follow: false,
		noimageindex: true,
	},
}

export const noIndexMetadata: Metadata = {
	robots: noIndexRobots,
}

type PageMetaInput = {
	title: string
	description?: string
	path?: string
	images?: string[]
	index?: boolean
	follow?: boolean
}

export function pageMetadata({
	title,
	description,
	path,
	images,
	index = true,
	follow = true,
}: PageMetaInput): Metadata {
	const url = path ? absoluteUrl(path) : undefined
	const ogImages = images?.filter(Boolean).map((image) => ({ url: image }))

	return {
		title,
		description,
		alternates: url ? { canonical: url } : undefined,
		robots: { index, follow },
		openGraph: {
			title,
			description,
			url,
			siteName: SITE_NAME,
			locale: 'pt_MZ',
			type: 'website',
			images: ogImages,
		},
		twitter: {
			card: ogImages?.length ? 'summary_large_image' : 'summary',
			title,
			description,
			images,
		},
	}
}

export function productDescription(
	name: string,
	storeName: string | null,
	raw?: string | null
) {
	if (raw?.trim()) return truncateText(raw)
	if (storeName) {
		return truncateText(
			`${name} à venda em ${storeName} no Zuka, o marketplace de Moçambique.`
		)
	}
	return truncateText(`${name} à venda no Zuka, o marketplace de Moçambique.`)
}

export function storeDescription(name: string, raw?: string | null) {
	if (raw?.trim()) return truncateText(raw)
	return truncateText(
		`Visite ${name} no Zuka. Produtos de vendedores locais em Moçambique.`
	)
}
