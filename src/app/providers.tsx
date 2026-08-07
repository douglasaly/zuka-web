'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { SellerEntryRedirect } from '@/modules/home/ui/components/seller-entry-redirect'
import { queryClient } from '@/lib/query-client'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute='class'
				defaultTheme='light'
				enableSystem={false}
				disableTransitionOnChange
			>
				<SellerEntryRedirect />
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	)
}
