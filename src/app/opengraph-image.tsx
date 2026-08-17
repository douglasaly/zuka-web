import { ogSize, renderOgImage } from '@/lib/seo/og-image'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site'

export const alt = `${SITE_NAME} — marketplace em Moçambique`
export const size = ogSize
export const contentType = 'image/png'

export default function OpenGraphImage() {
	return renderOgImage({
		title: SITE_NAME,
		subtitle: SITE_DESCRIPTION,
	})
}
