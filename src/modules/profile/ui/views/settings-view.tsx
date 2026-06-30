'use client'

import { ArrowLeft, Globe, Lock, MapPin, Moon, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/use-user-profile'
import {
	MOCK_NOTIFICATIONS,
	MOCK_PRIVACY,
	type SettingField,
} from '../../constants'
import { AccountFieldsForm } from '../components/settings/account-field-form'
import { DangerZone } from '../components/settings/danger-zone'
import { SettingsLinkRow } from '../components/settings/settings-link-row'
import { SettingsSkeleton } from '../components/settings/settings-skeleton'
import { SettingsToggleRow } from '../components/settings/settings-toggle-row'
import { SettingsSection } from '../sections/settings-section'

export const SettingsView = () => {
	const router = useRouter()
	const { profile, isSeller, isLoading, isAuthenticated } = useUserProfile()

	const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
	const [privacy, setPrivacy] = useState(MOCK_PRIVACY)

	const toggleNotification = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
		)
		// TODO: chamar API para guardar preferência
	}

	const togglePrivacy = (id: string) => {
		setPrivacy((prev) =>
			prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
		)
		// TODO: chamar API para guardar preferência
	}

	if (isLoading) {
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

	const accountFields: SettingField[] = profile
		? [
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
		: []

	return (
		<div className='mx-auto max-w-4xl space-y-8 px-4 py-8 md:py-12'>
			<div className='flex gap-1 items-center'>
				<Button variant='ghost' onClick={() => router.back()}>
					<ArrowLeft className='size-4' />
				</Button>

				<h1 className='font-heading text-2xl font-bold md:text-3xl'>
					Definições
				</h1>
			</div>

			<SettingsSection title='Conta' description='Os seus dados pessoais'>
				<AccountFieldsForm
					fields={accountFields}
					userId={profile?.id}
				/>
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
					description={'Português (Moçambique)'}
					href='/definicoes/idioma'
				/>
				<SettingsLinkRow
					icon={Moon}
					title='Aparência'
					description={'Tema claro'}
					href='/definicoes/aparencia'
				/>
				{isSeller && (
					<SettingsLinkRow
						icon={Store}
						title='Definições da loja'
						description='Gerir informações da sua loja'
						href='/dashboard/seller/definicoes'
					/>
				)}
			</SettingsSection>

			<SettingsSection
				title='Notificações'
				description='Escolha o que quer receber'
			>
				{notifications.map((n) => (
					<SettingsToggleRow
						key={n.id}
						title={n.title}
						description={n.description}
						checked={n.enabled}
						onCheckedChange={() => toggleNotification(n.id)}
					/>
				))}
			</SettingsSection>

			<SettingsSection title='Privacidade'>
				{privacy.map((p) => (
					<SettingsToggleRow
						key={p.id}
						title={p.title}
						description={p.description}
						checked={p.enabled}
						onCheckedChange={() => togglePrivacy(p.id)}
					/>
				))}
			</SettingsSection>

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
