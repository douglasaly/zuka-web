'use client'
import { ArrowLeft, Globe, Lock, MapPin, Moon, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
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

export const SettingsView = () => {
	const router = useRouter()
	const { profile, isSeller, isLoading, isAuthenticated } = useUserProfile()
	const {
		preferences,
		updatePreferences,
		isLoading: prefsLoading,
		isUpdating,
	} = useUserPreferences()
	const [draft, setDraft] = useState<BuyerDraft>(() =>
		buyerDraftFrom(preferences)
	)

	useEffect(() => {
		setDraft(buyerDraftFrom(preferences))
	}, [preferences])

	const dirty = isBuyerDraftDirty(draft, preferences)

	async function savePreferences() {
		try {
			await updatePreferences({
				buyer: {
					notifications: draft.notifications,
					privacy: draft.privacy,
				},
			})
			toast.success('Preferências guardadas')
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
				description='Escolha o que quer receber'
			>
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
