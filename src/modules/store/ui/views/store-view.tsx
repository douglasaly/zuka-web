'use client'

import {
	ArrowLeft,
	BadgeCheck,
	Heart,
	MapPin,
	Phone,
	Share2,
	Star,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExploreProductCard } from '@/components/explore-product-card'
import { Button } from '@/components/ui/button'
import { fetchStoreBySlug, STORE_PLACEHOLDER } from '@/lib/api/marketplace'
import type { StoreProfile } from '@/types/marketplace'
import { cn } from '@/lib/utils'

interface StoreViewProps {
	slug: string
}

const tabs = [
	{ value: 'products', label: 'Produtos' },
	{ value: 'about', label: 'Sobre' },
	{ value: 'reviews', label: 'Avaliações' },
]

export const StoreView = ({ slug }: StoreViewProps) => {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('products')

	const { data, isLoading } = useQuery({
		queryKey: ['store', slug],
		queryFn: () => fetchStoreBySlug(slug),
	})

	if (isLoading) {
		return (
			<div className='flex min-h-[50vh] items-center justify-center px-4'>
				<p className='text-muted-foreground'>A carregar loja...</p>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4'>
				<p className='text-muted-foreground'>Loja não encontrada.</p>
				<Button render={<Link href='/feed/explorar' />} variant='outline'>
					Voltar a explorar
				</Button>
			</div>
		)
	}

	const { store, products } = data

	return (
		<div className='pb-10'>
			<StoreHero store={store} onBack={() => router.back()} />
			<div className='mx-auto max-w-3xl px-4 md:px-6'>
				<StoreInfoCard store={store} />

				<div className='mt-6 flex gap-6 border-b border-border/60'>
					{tabs.map((tab) => (
						<button
							key={tab.value}
							type='button'
							onClick={() => setActiveTab(tab.value)}
							className={cn(
								'pb-3 text-sm font-medium transition-colors',
								activeTab === tab.value
									? 'border-b-2 border-primary text-foreground'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className='mt-6'>
					{activeTab === 'products' && (
						<div className='grid grid-cols-2 gap-3 sm:gap-4'>
							{products.length === 0 ? (
								<p className='col-span-2 py-8 text-center text-sm text-muted-foreground'>
									Esta loja ainda não tem produtos.
								</p>
							) : (
								products.map((product) => (
									<ExploreProductCard key={product.id} product={product} />
								))
							)}
						</div>
					)}

					{activeTab === 'about' && (
						<div className='rounded-2xl border border-border/60 bg-card p-5'>
							<p className='text-sm leading-relaxed text-muted-foreground'>
								{store.about || 'Sem descrição disponível.'}
							</p>
						</div>
					)}

					{activeTab === 'reviews' && (
						<div className='rounded-2xl border border-border/60 bg-card p-8 text-center'>
							<div className='mx-auto mb-2 flex items-center justify-center gap-1'>
								<Star className='size-5 fill-amber-400 text-amber-400' />
								<span className='text-2xl font-bold'>{store.rating}</span>
							</div>
							<p className='text-sm text-muted-foreground'>
								{store.reviewCount} avaliações de clientes
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function StoreHero({
	store,
	onBack,
}: {
	store: StoreProfile
	onBack: () => void
}) {
	return (
		<div className='relative h-48 overflow-hidden md:h-56'>
			<Image
				src={store.bannerUrl ?? STORE_PLACEHOLDER}
				alt={store.name}
				fill
				className='object-cover'
				priority
			/>
			<div className='absolute inset-0 bg-black/20' />

			<div className='absolute top-4 left-4 right-4 flex items-center justify-between'>
				<Button
					variant='secondary'
					size='icon-sm'
					type='button'
					onClick={onBack}
					className='rounded-full border border-border/60 bg-background/90 backdrop-blur-sm'
				>
					<ArrowLeft className='size-4' />
				</Button>
				<div className='flex gap-2'>
					<Button
						variant='secondary'
						size='icon-sm'
						type='button'
						className='rounded-full border border-border/60 bg-background/90 backdrop-blur-sm'
					>
						<Heart className='size-4' />
					</Button>
					<Button
						variant='secondary'
						size='icon-sm'
						type='button'
						className='rounded-full border border-border/60 bg-background/90 backdrop-blur-sm'
					>
						<Share2 className='size-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}

function StoreInfoCard({ store }: { store: StoreProfile }) {
	const whatsapp = store.whatsapp?.replace(/\D/g, '') ?? ''

	return (
		<div className='relative -mt-16 rounded-2xl border border-border/60 bg-card p-5'>
			<div className='flex gap-4'>
				<div className='relative size-20 shrink-0 overflow-hidden rounded-xl border-2 border-background'>
					<Image
						src={store.logoUrl ?? STORE_PLACEHOLDER}
						alt={store.name}
						fill
						className='object-cover'
					/>
				</div>
				<div className='min-w-0 flex-1 pt-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<h1 className='font-heading text-xl font-bold'>{store.name}</h1>
						{store.verified && (
							<span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700'>
								<BadgeCheck className='size-3' />
								Verificada
							</span>
						)}
					</div>
					<p className='mt-0.5 flex items-center gap-1 text-sm text-muted-foreground'>
						<MapPin className='size-3.5 shrink-0 text-secondary' />
						{store.location} · {store.neighborhood}
					</p>
					<div className='mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground'>
						<span className='flex items-center gap-1'>
							<Star className='size-3.5 fill-amber-400 text-amber-400' />
							<span className='font-medium text-foreground'>
								{store.rating}
							</span>
							({store.reviewCount})
						</span>
						<span>{store.followers.toLocaleString('pt-PT')} seguidores</span>
						<span>
							{store.productCount} produto
							{store.productCount !== 1 ? 's' : ''}
						</span>
					</div>
				</div>
			</div>

			<div className='mt-4 flex flex-col gap-2 sm:flex-row'>
				{whatsapp && (
					<Button
						className='flex-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a]'
						render={
							<a
								href={`https://wa.me/${whatsapp}`}
								target='_blank'
								rel='noopener noreferrer'
							/>
						}
					>
						WhatsApp
					</Button>
				)}
				{store.phone && (
					<Button
						variant='outline'
						className='flex-1 rounded-xl'
						render={<a href={`tel:${store.phone}`} />}
					>
						<Phone className='size-4' />
						Ligar
					</Button>
				)}
				<Button variant='outline' className='rounded-xl sm:px-6'>
					Seguir
				</Button>
			</div>
		</div>
	)
}
