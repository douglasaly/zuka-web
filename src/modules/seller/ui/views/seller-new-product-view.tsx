'use client'
import { useQuery } from '@tanstack/react-query'
import { Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { UserProfile } from '@/types/marketplace'
import { ProductForm } from '../components/product-form'
export const SellerNewProductView = () => {
	const { data: profile, isLoading } = useQuery<UserProfile | null>({
		queryKey: ['user-profile'],
		queryFn: async () => {
			const res = await fetch('/api/me/profile')
			if (res.status === 401) return null
			if (!res.ok) throw new Error('Failed to load profile')
			const json = await res.json()
			return json.profile as UserProfile
		},
	})
	if (isLoading) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center'>
				<div className='size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground' />
			</div>
		)
	}
	const store = profile?.stores?.[0]
	if (!store) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<Store className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Nenhuma loja encontrada
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					Precisa de uma loja para publicar produtos.
				</p>
				<Button
					className='mt-6 rounded-full'
					render={
						<Link href='/onboarding/seller'>Ir para o registo</Link>
					}
				/>
			</div>
		)
	}
	return <ProductForm mode='create' />
}
