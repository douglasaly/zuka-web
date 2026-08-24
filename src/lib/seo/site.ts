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

const DEFAULT_SITE_URL = 'http://localhost:3000'

/** Ensure env values like `my-app.vercel.app` become valid URL origins. */
function normalizeSiteOrigin(raw: string): string {
	const trimmed = raw.trim().replace(/\/+$/, '')
	if (!trimmed) return DEFAULT_SITE_URL
	if (/^https?:\/\//i.test(trimmed)) return trimmed
	return `https://${trimmed}`
}

function resolveSiteOrigin(): string {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
	if (appUrl) return normalizeSiteOrigin(appUrl)
	const vercelUrl = process.env.VERCEL_URL?.trim()
	if (vercelUrl) return normalizeSiteOrigin(vercelUrl)
	return DEFAULT_SITE_URL
}

export function getSiteUrl() {
	return resolveSiteOrigin()
}

export function getMetadataBase() {
	return new URL(getSiteUrl())
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
