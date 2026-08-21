'use client'
import { ArrowLeft, Bell, Globe, Lock, MapPin, Moon, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { useBrowserNotificationPermission } from '@/hooks/use-browser-notification-permission'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useUserProfile } from '@/hooks/use-user-profile'
import type { PreferencesDocument } from '@/lib/preferences/schema'
import {
	BUYER_NOTIFICATION_SETTINGS,
	BUYER_PRIVACY_SETTINGS,
	type SettingField,
} from '../../constants'
import { AccountFieldsForm } from '../components/settings/account-field-form'
import { DangerZone } from '../components/settings/danger-zone'
import { EmailVerificationStatus } from '../components/settings/email-verification-status'
import { SettingsLinkRow } from '../components/settings/settings-link-row'
import { SettingsSkeleton } from '../components/settings/settings-skeleton'
import { SettingsToggleRow } from '../components/settings/settings-toggle-row'
import { SettingsSection } from '../sections/settings-section'

const THEME_LABELS = {
	light: 'Tema claro',
	dark: 'Tema escuro',
	system: 'Tema do sistema',
} as const

const LOCALE_LABELS = {
	pt: 'Português (Moçambique)',
	en: 'English',
} as const

type BuyerDraft = {
	notifications: PreferencesDocument['buyer']['notifications']
	privacy: PreferencesDocument['buyer']['privacy']
}

function buyerDraftFrom(prefs: PreferencesDocument): BuyerDraft {
	return {
		notifications: { ...prefs.buyer.notifications },
		privacy: { ...prefs.buyer.privacy },
	}
}

function isBuyerDraftDirty(
	draft: BuyerDraft,
	prefs: PreferencesDocument
): boolean {
	const n = prefs.buyer.notifications
	const p = prefs.buyer.privacy
	return (
		draft.notifications.orders !== n.orders ||
		draft.notifications.promotions !== n.promotions ||
		draft.notifications.messages !== n.messages ||
		draft.privacy.profileVisible !== p.profileVisible
	)
}

function browserPermissionLabel(args: {
	ready: boolean
	supported: boolean
	granted: boolean
	denied: boolean
}): string {
	if (!args.ready) return 'A verificar…'
	if (!args.supported) {
		return 'Indisponível neste navegador.'
	}
	if (args.granted) {
		return 'Permitidas - alertas ao abrir a aplicação e quando há novidades.'
	}
	if (args.denied) {
		return 'Bloqueadas - altere a permissão deste site nas definições do navegador.'
	}
	return 'Ainda não pedidas - active para receber alertas no desktop.'
}

export const SettingsView = () => {
	const router = useRouter()
	const { profile, isSeller, isLoading, isAuthenticated } = useUserProfile()
	const {
		preferences,
		updatePreferences,
		isLoading: prefsLoading,
		isUpdating,
	} = useUserPreferences()
	const browserPermission = useBrowserNotificationPermission()
	const [draft, setDraft] = useState<BuyerDraft>(() =>
		buyerDraftFrom(preferences)
	)

	useEffect(() => {
		setDraft(buyerDraftFrom(preferences))
	}, [preferences])

	const dirty = isBuyerDraftDirty(draft, preferences)

	async function enableBrowserNotifications() {
		const result = await browserPermission.requestPermission()
		if (result === 'granted') {
			toast.success('Alertas do navegador activados')
		} else if (result === 'denied') {
			toast.error(
				'Notificações bloqueadas. Altere a permissão deste site nas definições do navegador.'
			)
		} else if (result === 'unsupported') {
			toast.error('Este navegador não suporta notificações.')
		}
	}

	async function savePreferences() {
		const wantsBrowserAlerts =
			draft.notifications.orders ||
			draft.notifications.promotions ||
			draft.notifications.messages

		let permissionNote: 'granted' | 'denied' | 'blocked' | null = null
		if (wantsBrowserAlerts && browserPermission.isDefault) {
			const result = await browserPermission.requestPermission()
			if (result === 'granted') permissionNote = 'granted'
			else if (result === 'denied') permissionNote = 'denied'
		} else if (wantsBrowserAlerts && browserPermission.denied) {
			permissionNote = 'blocked'
		}

		try {
			await updatePreferences({
				buyer: {
					notifications: draft.notifications,
					privacy: draft.privacy,
				},
			})
			if (permissionNote === 'granted') {
				toast.success('Preferências e alertas do navegador activados')
			} else if (permissionNote === 'denied') {
				toast.message(
					'Preferências guardadas. Alertas do navegador bloqueados - active-os nas definições do navegador.'
				)
			} else if (permissionNote === 'blocked') {
				toast.message(
					'Preferências guardadas. Para alertas no desktop, permita notificações para este site no navegador.'
				)
			} else {
				toast.success('Preferências guardadas')
			}
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Não foi possível guardar as preferências'
			)
		}
	}

	if (isLoading || (isAuthenticated && prefsLoading)) {
		return <SettingsSkeleton />
	}
	if (!isAuthenticated || !profile) {
		return (
			<div className='mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Entre na sua conta para ver as definições.
				</p>
				<Button
					render={
						<Link href='/auth/login?next=/definicoes'>Entrar</Link>
					}
				/>
			</div>
		)
	}
	const accountFields: SettingField[] = [
		{
			id: 'firstName',
			label: 'Nome',
			value: profile.firstName ?? '',
			type: 'text',
		},
		{
			id: 'lastName',
			label: 'Apelido',
			value: profile.lastName ?? '',
			type: 'text',
		},
		{
			id: 'email',
			label: 'Email',
			value: profile.email ?? '',
			type: 'email',
		},
		{
			id: 'phone',
			label: 'Telefone',
			value: profile.phoneNumber ?? '',
			type: 'tel',
		},
	]

	const showEnableBrowser =
		browserPermission.ready &&
		browserPermission.supported &&
		!browserPermission.granted

	return (
		<div className='mx-auto max-w-4xl space-y-8 px-4 py-8 md:py-12'>
			<div className='flex gap-1 items-center'>
				<IconTooltipButton label='Voltar' onClick={() => router.back()}>
					<ArrowLeft className='size-4' />
				</IconTooltipButton>

				<h1 className='font-heading text-2xl font-bold md:text-3xl'>
					Definições
				</h1>
			</div>

			<SettingsSection title='Conta' description='Os seus dados pessoais'>
				<AccountFieldsForm fields={accountFields} />
				<EmailVerificationStatus />
			</SettingsSection>

			<SettingsSection title='Geral'>
				<SettingsLinkRow
					icon={MapPin}
					title='Endereços'
					description='Gerir moradas de entrega'
					href='/definicoes/enderecos'
				/>
				<SettingsLinkRow
					icon={Globe}
					title='Idioma'
					description={LOCALE_LABELS[preferences.ui.locale]}
					href='/definicoes/idioma'
				/>
				<SettingsLinkRow
					icon={Moon}
					title='Aparência'
					description={THEME_LABELS[preferences.ui.theme]}
					href='/definicoes/aparencia'
				/>
				{isSeller && (
					<SettingsLinkRow
						icon={Store}
						title='Definições da loja'
						description='Gerir informações da sua loja'
						href='/dashboard/seller/configuracoes'
					/>
				)}
			</SettingsSection>

			<SettingsSection
				title='Notificações'
				description='Escolha o que quer receber e active alertas do browser'
			>
				<div className='flex min-w-0 items-start gap-3 border-b border-border/60 py-3 px-4'>
					<div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground'>
						<Bell className='size-5' />
					</div>
					<div className='min-w-0 flex-1 space-y-2'>
						<p className='text-sm font-medium'>
							Alertas do navegador
						</p>
						<p className='text-xs leading-relaxed text-muted-foreground'>
							{browserPermissionLabel(browserPermission)}
						</p>
						{showEnableBrowser && (
							<Button
								type='button'
								size='sm'
								variant={
									browserPermission.denied
										? 'outline'
										: 'secondary'
								}
								disabled={browserPermission.denied}
								onClick={() =>
									void enableBrowserNotifications()
								}
							>
								{browserPermission.denied
									? 'Bloqueadas pelo navegador'
									: 'Activar notificações do navegador'}
							</Button>
						)}
					</div>
				</div>
				{BUYER_NOTIFICATION_SETTINGS.map((n) => (
					<SettingsToggleRow
						key={n.id}
						title={n.title}
						description={n.description}
						checked={draft.notifications[n.id]}
						onCheckedChange={(checked) => {
							setDraft((prev) => ({
								...prev,
								notifications: {
									...prev.notifications,
									[n.id]: checked,
								},
							}))
						}}
					/>
				))}
			</SettingsSection>

			<SettingsSection title='Privacidade'>
				{BUYER_PRIVACY_SETTINGS.map((p) => (
					<SettingsToggleRow
						key={p.id}
						title={p.title}
						description={p.description}
						checked={draft.privacy[p.id]}
						onCheckedChange={(checked) => {
							setDraft((prev) => ({
								...prev,
								privacy: {
									...prev.privacy,
									[p.id]: checked,
								},
							}))
						}}
					/>
				))}
			</SettingsSection>

			<div className='flex justify-end'>
				<Button
					disabled={!dirty || isUpdating}
					onClick={() => void savePreferences()}
				>
					{isUpdating ? 'A guardar…' : 'Guardar preferências'}
				</Button>
			</div>

			<SettingsSection title='Segurança'>
				<SettingsLinkRow
					icon={Lock}
					title='Alterar palavra-passe'
					href='/perfil/definicoes/seguranca/palavra-passe'
				/>
			</SettingsSection>

			<DangerZone />
		</div>
	)
}
