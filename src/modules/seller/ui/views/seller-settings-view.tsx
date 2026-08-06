'use client'

/**
 * THESIS: Settings as a grouped task index — destinations and danger in clear
 * bands; refuses four equal icon-cards and dead "#" actions.
 * OWN-WORLD: Seller dashboard Operate (rounded-2xl sections, list rows, meta chrome).
 * STORY: Jump to loja/membros/password; see account; exit or delete with intent.
 * FIRST VIEWPORT: Identity strip + two-column desktop (destinos | alertas/risco).
 * FORM: Extend seller Operate surface (same grammar as Minha Loja).
 * LAYOUT: Mobile stacks; lg+ fills width with 2 columns — no orphan max-w-2xl void.
 */

import {
	ChevronRight,
	ExternalLink,
	Loader2,
	Lock,
	LogOut,
	type LucideIcon,
	Store,
	Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useUserProfile } from '@/hooks/use-user-profile'
import { cn } from '@/lib/utils'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'
import { SellerDangerZone } from '../components/settings/seller-danger-zone'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'

const PREFS_KEY = 'zuka:seller-notification-prefs'

type NotificationPrefs = {
	orders: boolean
	messages: boolean
	reviews: boolean
}

const DEFAULT_PREFS: NotificationPrefs = {
	orders: true,
	messages: true,
	reviews: true,
}

function readPrefs(): NotificationPrefs {
	if (typeof window === 'undefined') return DEFAULT_PREFS
	try {
		const raw = localStorage.getItem(PREFS_KEY)
		if (!raw) return DEFAULT_PREFS
		const parsed = JSON.parse(raw) as Partial<NotificationPrefs>
		return {
			orders: parsed.orders ?? DEFAULT_PREFS.orders,
			messages: parsed.messages ?? DEFAULT_PREFS.messages,
			reviews: parsed.reviews ?? DEFAULT_PREFS.reviews,
		}
	} catch {
		return DEFAULT_PREFS
	}
}

type NavRowProps = {
	icon: LucideIcon
	title: string
	description: string
	href: string
	external?: boolean
}

function NavRow({
	icon: Icon,
	title,
	description,
	href,
	external,
}: NavRowProps) {
	const className = cn(
		'flex min-w-0 items-center gap-3 px-3.5 py-3.5 transition-colors duration-150 sm:px-4',
		'hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none',
		'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset'
	)

	const content = (
		<>
			<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/70'>
				<Icon className='size-4 text-muted-foreground' aria-hidden />
			</span>
			<span className='min-w-0 flex-1'>
				<span className='block text-sm font-medium'>{title}</span>
				<span className='mt-0.5 block text-xs leading-relaxed wrap-break-word text-muted-foreground'>
					{description}
				</span>
			</span>
			{external ? (
				<ExternalLink
					className='size-3.5 shrink-0 text-muted-foreground'
					aria-hidden
				/>
			) : (
				<ChevronRight
					className='size-4 shrink-0 text-muted-foreground'
					aria-hidden
				/>
			)}
		</>
	)

	if (external) {
		return (
			<a
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				className={className}
			>
				{content}
			</a>
		)
	}

	return (
		<Link href={href} className={className}>
			{content}
		</Link>
	)
}

function SettingsBand({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children: React.ReactNode
}) {
	return (
		<section className='min-w-0 space-y-3'>
			<div className='min-w-0 px-0.5'>
				<h2 className='font-heading text-base font-semibold tracking-tight'>
					{title}
				</h2>
				{description ? (
					<p className='mt-1 text-sm text-muted-foreground'>
						{description}
					</p>
				) : null}
			</div>
			<div className='min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
				<div className='divide-y divide-border/50'>{children}</div>
			</div>
		</section>
	)
}

function PrefRow({
	id,
	title,
	description,
	checked,
	onCheckedChange,
}: {
	id: string
	title: string
	description: string
	checked: boolean
	onCheckedChange: (v: boolean) => void
}) {
	return (
		<div className='flex min-w-0 items-center gap-3 px-3.5 py-3.5 sm:px-4'>
			<div className='min-w-0 flex-1'>
				<label
					htmlFor={id}
					className='cursor-pointer text-sm font-medium'
				>
					{title}
				</label>
				<p className='mt-0.5 text-xs leading-relaxed wrap-break-word text-muted-foreground'>
					{description}
				</p>
			</div>
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-describedby={`${id}-desc`}
			/>
			<span id={`${id}-desc`} className='sr-only'>
				{description}
			</span>
		</div>
	)
}

export const SellerSettingsView = () => {
	useSetSellerPageMeta({
		title: 'Configurações',
		crumbs: ['Dashboard', 'Configurações'],
	})

	const { profile, isLoading, isAuthenticated } = useUserProfile()
	const { can } = useSellerAccess()
	const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS)
	const [prefsReady, setPrefsReady] = useState(false)

	useEffect(() => {
		setPrefs(readPrefs())
		setPrefsReady(true)
	}, [])

	function updatePref(key: keyof NotificationPrefs, value: boolean) {
		setPrefs((prev) => {
			const next = { ...prev, [key]: value }
			try {
				localStorage.setItem(PREFS_KEY, JSON.stringify(next))
			} catch {
				/* ignore quota / private mode */
			}
			return next
		})
	}

	if (isLoading) {
		return (
			<div className='min-w-0 max-w-6xl space-y-6'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
					<Skeleton className='h-4 w-56' />
					<Skeleton className='h-16 w-full rounded-2xl lg:max-w-md' />
				</div>
				<div className='grid gap-6 lg:grid-cols-2'>
					<div className='space-y-6'>
						<Skeleton className='h-44 w-full rounded-2xl' />
						<Skeleton className='h-36 w-full rounded-2xl' />
					</div>
					<div className='space-y-6'>
						<Skeleton className='h-44 w-full rounded-2xl' />
						<Skeleton className='h-28 w-full rounded-2xl' />
					</div>
				</div>
			</div>
		)
	}

	if (!isAuthenticated || !profile) {
		return (
			<div className='flex min-w-0 max-w-6xl flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center'>
				<h2 className='font-heading text-lg font-bold tracking-tight'>
					Sessão necessária
				</h2>
				<p className='mt-1.5 max-w-sm text-sm text-muted-foreground'>
					Entre na sua conta para gerir as configurações da loja.
				</p>
				<Button
					className='mt-6 rounded-full'
					render={
						<Link href='/auth/login?next=/dashboard/seller/configuracoes'>
							Entrar
						</Link>
					}
				/>
			</div>
		)
	}

	const store = profile.stores[0]
	const displayName = [profile.firstName, profile.lastName]
		.filter(Boolean)
		.join(' ')
		.trim()
	const storeName = store?.name || displayName || 'A sua conta'

	return (
		<div className='min-w-0 max-w-6xl space-y-6 pb-8'>
			<div className='flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8'>
				<p className='max-w-md text-sm leading-snug text-muted-foreground'>
					Conta, loja e alertas. Tudo num único lugar.
				</p>

				<div className='flex min-w-0 w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:max-w-md sm:gap-3.5 sm:px-4'>
					<span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/70'>
						<Store
							className='size-4 text-muted-foreground'
							aria-hidden
						/>
					</span>
					<div className='min-w-0 flex-1'>
						<p className='truncate font-heading text-sm font-semibold tracking-tight sm:text-base'>
							{storeName}
						</p>
						<p className='mt-0.5 truncate text-xs text-muted-foreground sm:text-sm'>
							{profile.email}
							{store?.slug ? (
								<span className='text-xs'>
									{' '}
									· /{store.slug}
								</span>
							) : null}
						</p>
					</div>
				</div>
			</div>

			<div className='grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start lg:gap-8'>
				<div className='min-w-0 space-y-6'>
					<SettingsBand
						title='Loja'
						description='Aparência pública e Equipe.'
					>
						{can('store.read') ? (
							<NavRow
								icon={Store}
								title='Minha loja'
								description={
									can('store.update')
										? 'Nome, imagens, contactos, entrega e estado'
										: 'Ver perfil da loja (sem edição)'
								}
								href='/dashboard/seller/loja'
							/>
						) : null}
						{can('member.read') ? (
							<NavRow
								icon={Users}
								title='Membros'
								description={
									can('member.manage')
										? 'Convidar e gerir quem tem acesso ao painel'
										: 'Ver quem tem acesso ao painel da loja'
								}
								href='/dashboard/seller/loja/membros'
							/>
						) : null}
						{store?.slug ? (
							<NavRow
								icon={ExternalLink}
								title='Ver como comprador'
								description='Abrir a página pública da loja'
								href={`/lojas/${store.slug}`}
								external
							/>
						) : null}
					</SettingsBand>

					<SettingsBand
						title='Conta e segurança'
						description='Dados de acesso da sua conta Zuka.'
					>
						<NavRow
							icon={Lock}
							title='Alterar palavra-passe'
							description='Actualize a senha da conta'
							href='/perfil/definicoes/seguranca/palavra-passe'
						/>
						<NavRow
							icon={LogOut}
							title='Sair da sessão'
							description='Terminar sessão neste dispositivo'
							href='/log-out'
						/>
					</SettingsBand>
				</div>

				<div className='min-w-0 space-y-6'>
					<SettingsBand
						title='Notificações'
						description='Alertas da loja. Guardadas neste dispositivo por agora.'
					>
						{prefsReady ? (
							<>
								<PrefRow
									id='pref-orders'
									title='Novos pedidos'
									description='Quando receber um pedido novo'
									checked={prefs.orders}
									onCheckedChange={(v) =>
										updatePref('orders', v)
									}
								/>
								<PrefRow
									id='pref-messages'
									title='Mensagens'
									description='Quando um cliente enviar uma mensagem'
									checked={prefs.messages}
									onCheckedChange={(v) =>
										updatePref('messages', v)
									}
								/>
								<PrefRow
									id='pref-reviews'
									title='Avaliações'
									description='Quando a loja receber uma avaliação'
									checked={prefs.reviews}
									onCheckedChange={(v) =>
										updatePref('reviews', v)
									}
								/>
							</>
						) : (
							<div className='flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground'>
								<Loader2 className='size-4 animate-spin' />A
								carregar preferências…
							</div>
						)}
					</SettingsBand>

					<SellerDangerZone />
				</div>
			</div>
		</div>
	)
}
