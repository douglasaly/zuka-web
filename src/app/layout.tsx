import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
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
	title: {
		default: 'Zuka — Marketplace Multi-vendedor',
		template: '%s | Zuka',
	},
	description:
		'Descubra produtos únicos de vendedores locais em Moçambique. Compre com confiança no marketplace Zuka.',
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
