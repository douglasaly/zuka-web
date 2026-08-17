export const SITE_NAME = 'Zuka'
export const SITE_TAGLINE = 'Marketplace Multivendedor'
export const SITE_LOCALE = 'pt_MZ'
export const SITE_LANGUAGE = 'pt'

export const SITE_DESCRIPTION =
	'Descubra produtos únicos de vendedores locais em Moçambique. Compre com confiança no Marketplace Zuka.'

export const SITE_KEYWORDS = [
	'Zuka',
	'marketplace em Moçambique',
	'comprar online em Moçambique',
	'vender online em Moçambique',
	'lojas em Moçambique',
	'produtos em Maputo',
	'produtos em Gaza',
	'produtos em Tete',
	'produtos em Nampula',
	'produtos em Beira',
	'produtos em Pemba',
	'produtos em Quelimane',
	'produtos em Lichinga',
	'produtos em Chimoio',
	'marketplace multivendedor em Moçambique',
]

const FALLBACK_SITE_URL =
	process.env.VERCEL_URL ||
	process.env.NEXT_PUBLIC_APP_URL ||
	'http://localhost:3000'

export function getSiteUrl() {
	const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || FALLBACK_SITE_URL
	return raw.replace(/\/+$/, '')
}

export function getMetadataBase() {
	try {
		return new URL(getSiteUrl())
	} catch {
		return new URL(FALLBACK_SITE_URL)
	}
}

export function absoluteUrl(path = '/') {
	const normalized = path.startsWith('/') ? path : `/${path}`
	return new URL(normalized, `${getSiteUrl()}/`).toString()
}

export function truncateText(value: string, max = 160) {
	const clean = value.replace(/\s+/g, ' ').trim()
	if (clean.length <= max) return clean
	return `${clean.slice(0, max - 1).trimEnd()}…`
}
