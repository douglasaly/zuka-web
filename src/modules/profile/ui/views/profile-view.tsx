'use client'

import {
	BadgeCheck,
	ChevronRight,
	CircleQuestionMark,
	Heart,
	LogOut,
	Package,
	Settings,
	ShoppingBag,
	Store,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { useSavedItems } from '@/hooks/use-saved-items'
import { useUserProfile } from '@/hooks/use-user-profile'
import { normalizeStore } from '@/types/stores'
import { EmptyState } from '../components/empty-state'
import { FollowedStoreCard } from '../components/followed-store-card'
import { ProfileActionLink } from '../components/product-action-link'
import { ProfileSkeleton } from '../components/profile-skeleton'
import { ProfileStats } from '../components/profile-stats'
import { SavedItemCard } from '../components/saved-item-card'
import { SegmentedTabs } from '../components/segmented-tabs'

const TABS = [
	{ title: 'Guardados', icon: Heart },
	{ title: 'Lojas seguidas', icon: Store },
]

export const ProfileView = () => {
	const [tab, setTab] = useState('Guardados')
	const router = useRouter()
	const {
		profile,
		isAuthenticated,
		isLoading,
		isSeller,
		followedCount,
		followedStores,
	} = useUserProfile()

	const { savedItems, toggleSavedItem, isRemoving, isSavedItemsLoading } =
		useSavedItems()

	if (isLoading) {
		return <ProfileSkeleton />
	}

	if (!isAuthenticated || !profile) {
		return (
			<div className='mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Entre na sua conta para ver o perfil.
				</p>
				<Button
					render={<Link href='/auth/login?next=/perfil'>Entrar</Link>}
				/>
			</div>
		)
	}

	const displayName =
		[profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
		'Utilizador'

	const stats = [
		{ label: 'Guardados', value: savedItems.length },
		{ label: 'A seguir', value: followedCount },
		{ label: 'Pedidos', value: 5 }, // TODO: ligar à API de pedidos
	]

	const options = [
		{ title: 'Definições', icon: Settings, url: '/perfil/definicoes' },
		{
			title: 'Ajuda e suporte',
			icon: CircleQuestionMark,
			url: '/ajuda-e-suporte',
		},
		{ title: 'Sair', icon: LogOut, url: '/log-out' },
	]

	function handleRemoveItem(itemId: string) {
		toggleSavedItem(itemId)
	}

	const normalizedStores = followedStores.map(normalizeStore) ?? []

	return (
		<div className='mx-auto max-w-4xl px-4 py-8 md:py-12'>
			<h1 className='mb-6 font-heading text-2xl font-bold md:text-3xl'>
				O meu perfil
			</h1>

			<div className='space-y-4'>
				{/* PERFIL */}
				<div className='rounded-2xl border border-border/60 bg-card p-5'>
					<div className='flex gap-4'>
						<UserAvatar
							imageUrl={profile.avatarUrl}
							name={displayName}
							size='xl'
						/>

						<div>
							<div className='flex gap-1 items-baseline'>
								<p className='text-lg font-semibold'>
									{displayName}
								</p>
								{profile.emailVerified && (
									<BadgeCheck className='size-4 text-white bg-green-400 rounded-full' />
								)}
							</div>
							<p className='text-sm text-muted-foreground'>
								{profile.email}
							</p>
							<p className='mt-2 text-xs text-muted-foreground'>
								Perfil:{' '}
								{isSeller
									? 'Comprador e vendedor'
									: 'Comprador'}
							</p>
						</div>
					</div>

					<ProfileStats stats={stats} />
				</div>

				{/* TABS */}
				<div className='flex flex-col w-full gap-4'>
					<SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />

					{tab === 'Guardados' && (
						<div className='flex flex-wrap gap-3'>
							{savedItems.length === 0 ? (
								<div className='w-full'>
									<EmptyState
										icon={Heart}
										title='Ainda não guardou nada'
										description='Toque no coração de um produto para o guardar aqui'
									/>
								</div>
							) : (
								savedItems.map((item) => (
									<SavedItemCard
										key={item.id}
										item={item}
										onRemove={() =>
											handleRemoveItem(item.id)
										}
										isRemoving={isRemoving}
									/>
								))
							)}
						</div>
					)}

					{tab === 'Lojas seguidas' && (
						<div className='flex flex-col gap-3'>
							{followedStores.length === 0 ? (
								<EmptyState
									icon={Store}
									title='Ainda não segue nenhuma loja'
									description='Siga lojas para ver as novidades delas aqui'
								/>
							) : (
								normalizedStores.map((store) => (
									<FollowedStoreCard
										key={store.id}
										store={store}
									/>
								))
							)}
						</div>
					)}
				</div>

				{/* AÇÕES */}
				<div className='grid gap-3 sm:grid-cols-2'>
					<ProfileActionLink
						href='/feed/pedidos'
						icon={ShoppingBag}
						iconClassName='text-secondary'
						title='Os meus pedidos'
						description='Acompanhe as suas compras'
					/>

					{isSeller ? (
						<ProfileActionLink
							href='/dashboard/seller'
							icon={Store}
							iconClassName='text-emerald-600'
							title='Painel do vendedor'
							description='Gerir loja e produtos'
						/>
					) : (
						<ProfileActionLink
							href='/onboarding'
							icon={Package}
							iconClassName='text-emerald-600'
							title='Abrir uma loja'
							description='Publicar produtos no marketplace'
						/>
					)}
				</div>

				{/* OPÇÕES */}
				<div className='flex flex-col w-full min-w-0 border rounded-xl'>
					{options.map((opt) => {
						const Icon = opt.icon

						return (
							<Button
								variant='ghost'
								key={opt.title}
								className='flex justify-between py-4 px-3 h-12 border-b-black/20 last:border-b-0'
								onClick={() => router.push(`${opt.url}`)}
								render={
									<div className='rounded-none first:rounded-t-xl rounded-b-none last:rounded-b-xl'>
										<div className='flex items-center justify-center'>
											<Icon className='size-5 mr-2' />
											{opt.title}
										</div>
										<ChevronRight className='size-5 text-muted-foreground' />
									</div>
								}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}
