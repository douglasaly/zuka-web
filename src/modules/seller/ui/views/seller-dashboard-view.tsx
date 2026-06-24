'use client'

import { ExternalLink, Package, ShoppingBag, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Button } from '@/components/ui/button'
import {
	fetchSellerOrders,
	fetchSellerProducts,
	fetchUserProfile,
	PRODUCT_PLACEHOLDER,
} from '@/lib/api/marketplace'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import { formatPrice } from '@/utils/format-price'
import Image from 'next/image'
import { CreateProductForm } from '../components/create-product-form'

interface Category {
	id: string
	name: string
}

export const SellerDashboardView = () => {
	const router = useRouter()

	const { data: profile, isLoading, error } = useQuery({
		queryKey: ['user-profile'],
		queryFn: async () => {
			if (!auth.currentUser) return null
			await createAppSession()
			return fetchUserProfile()
		},
	})

	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
		enabled: Boolean(profile?.roles.includes('seller')),
	})

	const onboardingComplete =
		profile?.onboarding?.status === 'APPROVED' && (profile?.stores.length ?? 0) > 0

	useEffect(() => {
		if (!profile || !profile.roles.includes('seller')) return

		const needsOnboarding =
			!profile.stores.length ||
			profile.onboarding?.status === 'DRAFT' ||
			profile.onboarding?.status === 'SUBMITTED'

		if (needsOnboarding) {
			router.replace('/onboarding/seller')
		}
	}, [profile, router])

	const { data: sellerOrders = [] } = useQuery({
		queryKey: ['seller-orders'],
		queryFn: fetchSellerOrders,
		enabled: Boolean(profile?.roles.includes('seller') && profile.stores.length > 0),
	})

	const { data: sellerProducts = [] } = useQuery({
		queryKey: ['seller-products', profile?.stores[0]?.id],
		queryFn: fetchSellerProducts,
		enabled: Boolean(profile?.roles.includes('seller') && profile.stores.length > 0),
	})

	if (!auth.currentUser && !isLoading) {
		return (
			<div className='mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Precisa de entrar na sua conta para aceder ao painel de vendedor.
				</p>
				<Button render={<Link href='/auth/login?next=/dashboard/seller'>Entrar</Link>} />
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-12 text-center text-muted-foreground'>
				A carregar painel...
			</div>
		)
	}

	if (!profile) {
		return (
			<div className='mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Sessão expirada. Entre novamente para continuar.
				</p>
				<Button render={<Link href='/auth/login?next=/dashboard/seller'>Entrar</Link>} />
			</div>
		)
	}

	if (!profile.roles.includes('seller')) {
		return (
			<div className='mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
				<Store className='size-10 text-muted-foreground' />
				<h1 className='font-heading text-xl font-bold'>Painel de vendedor</h1>
				<p className='text-sm text-muted-foreground'>
					Ainda não configurou a sua conta como vendedor.
				</p>
				<Button render={<Link href='/onboarding' />}>Escolher perfil</Button>
			</div>
		)
	}

	const store = profile.stores[0]

	if (!store || !onboardingComplete) {
		return (
			<div className='mx-auto max-w-xl px-4 py-12 text-center text-muted-foreground'>
				A redirecionar para o registo da loja...
			</div>
		)
	}

	return (
		<div className='mx-auto max-w-3xl px-4 py-8 md:py-12'>
			<div className='mb-8 flex items-start justify-between gap-4'>
				<div className='space-y-1'>
					<h1 className='font-heading text-2xl font-bold'>Painel da loja</h1>
					<p className='text-sm text-muted-foreground'>
						Gerir produtos e pedidos da sua loja
					</p>
				</div>
				<Button
					variant='outline'
					size='sm'
					render={<Link href={`/lojas/${store.slug}`} />}
				>
					<ExternalLink className='size-4' />
					Ver loja
				</Button>
			</div>

			<div className='grid gap-4 sm:grid-cols-2'>
				<div className='rounded-2xl border border-border/60 bg-card p-5'>
					<div className='mb-3 flex items-center gap-2 text-muted-foreground'>
						<Store className='size-4' />
						<span className='text-sm font-medium'>A sua loja</span>
					</div>
					<p className='font-heading text-lg font-bold'>{store.name}</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						Estado: {store.status ?? 'PENDING'}
					</p>
				</div>

				<div className='rounded-2xl border border-border/60 bg-card p-5'>
					<div className='mb-3 flex items-center gap-2 text-muted-foreground'>
						<Package className='size-4' />
						<span className='text-sm font-medium'>Produtos</span>
					</div>
					<p className='font-heading text-3xl font-bold'>
						{store.productCount}
					</p>
					<p className='mt-1 text-sm text-muted-foreground'>
						produtos publicados
					</p>
				</div>
			</div>

			<div className='mt-8 space-y-4'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<h2 className='font-heading text-lg font-bold'>Produtos da loja</h2>
					<CreateProductForm categories={categories} storeId={store.id} />
				</div>

				{sellerProducts.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						Ainda não publicou produtos. Apenas a sua loja pode criar anúncios.
					</p>
				) : (
					<div className='space-y-3'>
						{sellerProducts.map((product) => (
							<div
								key={product.id}
								className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4'
							>
								<div className='relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted'>
									<Image
										src={product.image ?? PRODUCT_PLACEHOLDER}
										alt={product.name}
										fill
										className='object-cover'
									/>
								</div>
								<div className='min-w-0 flex-1'>
									<p className='truncate font-semibold'>{product.name}</p>
									<p className='text-sm text-muted-foreground'>
										{product.categoryName ?? 'Sem categoria'} ·{' '}
										{product.isVisible ? 'Visível' : 'Oculto'}
									</p>
								</div>
								<p className='font-bold'>
									{formatPrice(
										product.discountPrice ?? product.price,
										product.currency
									)}
								</p>
							</div>
						))}
					</div>
				)}
			</div>

			<div className='mt-8 space-y-4'>
				<div className='flex items-center gap-2'>
					<ShoppingBag className='size-4 text-muted-foreground' />
					<h2 className='font-heading text-lg font-bold'>Pedidos da loja</h2>
				</div>

				{sellerOrders.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						Ainda não há pedidos para a sua loja.
					</p>
				) : (
					<div className='space-y-3'>
						{sellerOrders.map((order) => (
							<div
								key={order.id}
								className='flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4'
							>
								<div>
									<p className='font-medium'>{order.date}</p>
									<p className='text-sm text-muted-foreground'>
										{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
									</p>
								</div>
								<div className='flex items-center gap-3'>
									<OrderStatusBadge
										status={order.status}
										label={order.statusLabel}
									/>
									<span className='font-bold'>
										{order.total.toLocaleString('pt-PT')} {order.currency}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{error && (
				<p className='mt-4 text-sm text-destructive'>
					Não foi possível carregar o perfil.
				</p>
			)}
		</div>
	)
}
