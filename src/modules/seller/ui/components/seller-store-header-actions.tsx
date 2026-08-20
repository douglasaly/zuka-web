'use client'

import { useQuery } from '@tanstack/react-query'
import { Copy, CopyCheck, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { absoluteUrl } from '@/lib/seo/site'
import type { GetSellerStoreOutput } from '@/lib/types/api/seller'

export function SellerStoreHeaderActions() {
	const [copied, setCopied] = useState(false)
	const { data } = useQuery<GetSellerStoreOutput>({
		queryKey: ['seller-store'],
		queryFn: async () => {
			const res = await fetch('/api/seller/store')
			if (!res.ok) {
				throw new Error('Failed to load store')
			}
			return res.json()
		},
		retry: false,
	})

	const slug = data?.store?.slug

	const handleCopy = async () => {
		if (!slug) return
		await navigator.clipboard.writeText(absoluteUrl(`/lojas/${slug}`))
		toast.success('Link copiado')
		setCopied(true)
		setTimeout(() => setCopied(false), 3000)
	}

	if (!slug) return null

	return (
		<div className='flex items-center gap-1.5'>
			<Link
				href={`/lojas/${slug}`}
				target='_blank'
				className='hidden items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex'
			>
				<ExternalLink className='size-3' />
				Ver loja
			</Link>
			<IconTooltipButton
				label='Copiar link da loja'
				onClick={handleCopy}
				variant='ghost'
				size='icon-sm'
			>
				{copied ? (
					<CopyCheck className='size-3.5 text-green-600' />
				) : (
					<Copy className='size-3.5' />
				)}
			</IconTooltipButton>
		</div>
	)
}
