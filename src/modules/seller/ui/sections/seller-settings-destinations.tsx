'use client'
import { ExternalLink, Lock, LogOut, Store, Users } from 'lucide-react'
import type { StorePermission } from '@/lib/auth/store-permissions'
import { SettingsBand } from '@/modules/seller/ui/components/settings/settings-band'
import { SettingsNavRow } from '@/modules/seller/ui/components/settings/settings-nav-row'

type SellerSettingsDestinationsProps = {
	can: (permission: StorePermission) => boolean
	storeSlug?: string | null
}
export function SellerSettingsDestinations({
	can,
	storeSlug,
}: SellerSettingsDestinationsProps) {
	return (
		<div className='min-w-0 space-y-6'>
			<SettingsBand
				title='Loja'
				description='Aparência pública e Equipe.'
			>
				{can('store.read') ? (
					<SettingsNavRow
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
					<SettingsNavRow
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
				{storeSlug ? (
					<SettingsNavRow
						icon={ExternalLink}
						title='Ver como comprador'
						description='Abrir a página pública da loja'
						href={`/lojas/${storeSlug}`}
						external
					/>
				) : null}
			</SettingsBand>

			<SettingsBand
				title='Conta e segurança'
				description='Dados de acesso da sua conta Zuka.'
			>
				<SettingsNavRow
					icon={Lock}
					title='Alterar palavra-passe'
					description='Actualize a senha da conta'
					href='/perfil/definicoes/seguranca/palavra-passe'
				/>
				<SettingsNavRow
					icon={LogOut}
					title='Sair da sessão'
					description='Terminar sessão neste dispositivo'
					href='/log-out'
				/>
			</SettingsBand>
		</div>
	)
}
