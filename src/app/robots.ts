import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
	const siteUrl = getSiteUrl()

	return {
		rules: [
			{
				userAgent: '*',
				allow: '/',
				disallow: [
					'/api/',
					'/admin/',
					'/dashboard/',
					'/mensagens/',
					'/notificacoes/',
					'/definicoes/',
					'/onboarding/',
					'/perfil/',
					'/carrinho',
					'/feed/pedidos',
					'/area-restrita',
					'/api-doc',
					'/log-out',
					'/auth/recuperar',
					'/auth/redefinir',
				],
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	}
}
