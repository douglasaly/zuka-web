import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { JsonLd } from '@/lib/seo/json-ld'
import { siteGraphJsonLd } from '@/lib/seo/schema'
import {
	getMetadataBase,
	SITE_DESCRIPTION,
	SITE_KEYWORDS,
	SITE_NAME,
} from '@/lib/seo/site'
import { cn } from '@/lib/utils'
import { Providers } from './providers'

const jakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
	variable: '--font-sans',
})
const jakartaHeading = Plus_Jakarta_Sans({
	subsets: ['latin'],
	weight: ['600', '700', '800'],
	variable: '--font-heading',
})

export const metadata: Metadata = {
	metadataBase: getMetadataBase(),
	title: {
		default: `${SITE_NAME} | Marketplace Multivendedor`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: SITE_KEYWORDS,
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	publisher: SITE_NAME,
	category: 'marketplace',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: 'website',
		locale: 'pt_MZ',
		siteName: SITE_NAME,
		title: `${SITE_NAME} | Marketplace Multivendedor`,
		description: SITE_DESCRIPTION,
	},
	twitter: {
		card: 'summary_large_image',
		title: `${SITE_NAME} | Marketplace Multivendedor`,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
			'max-video-preview': -1,
		},
	},
	verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
		? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
		: undefined,
	appleWebApp: {
		capable: true,
		title: SITE_NAME,
		statusBarStyle: 'default',
	},
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#111111' },
		{ media: '(prefers-color-scheme: dark)', color: '#fafafa' },
	],
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='pt'
			className={cn(jakarta.variable, jakartaHeading.variable)}
			suppressHydrationWarning
			data-scroll-behavior='smooth'
		>
			<body
				className={cn(
					'min-h-screen flex flex-col font-sans',
					jakarta.className
				)}
				suppressHydrationWarning
			>
				<JsonLd data={siteGraphJsonLd()} />
				<a
					href='#main-content'
					className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background'
				>
					Saltar para o conteúdo principal
				</a>
				<Toaster position='top-center' richColors closeButton />
				<TooltipProvider>
					<Providers>{children}</Providers>
				</TooltipProvider>
			</body>
		</html>
	)
}
