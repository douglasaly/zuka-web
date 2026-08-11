'use client'

import { Loader2 } from 'lucide-react'
import type { NotificationPrefs } from '@/modules/seller/hooks/use-seller-settings'
import { SellerDangerZone } from '@/modules/seller/ui/components/settings/seller-danger-zone'
import { SettingsBand } from '@/modules/seller/ui/components/settings/settings-band'
import { SettingsPrefRow } from '@/modules/seller/ui/components/settings/settings-pref-row'

type SellerSettingsAlertsProps = {
	prefs: NotificationPrefs
	prefsReady: boolean
	onUpdatePref: (key: keyof NotificationPrefs, value: boolean) => void
}

export function SellerSettingsAlerts({
	prefs,
	prefsReady,
	onUpdatePref,
}: SellerSettingsAlertsProps) {
	return (
		<div className='min-w-0 space-y-6'>
			<SettingsBand
				title='Notificações'
				description='Alertas da loja. Guardadas neste dispositivo por agora.'
			>
				{prefsReady ? (
					<>
						<SettingsPrefRow
							id='pref-orders'
							title='Novos pedidos'
							description='Quando receber um pedido novo'
							checked={prefs.orders}
							onCheckedChange={(v) => onUpdatePref('orders', v)}
						/>
						<SettingsPrefRow
							id='pref-messages'
							title='Mensagens'
							description='Quando um cliente enviar uma mensagem'
							checked={prefs.messages}
							onCheckedChange={(v) => onUpdatePref('messages', v)}
						/>
						<SettingsPrefRow
							id='pref-reviews'
							title='Avaliações'
							description='Quando a loja receber uma avaliação'
							checked={prefs.reviews}
							onCheckedChange={(v) => onUpdatePref('reviews', v)}
						/>
					</>
				) : (
					<div className='flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground'>
						<Loader2 className='size-4 animate-spin' />A carregar
						preferências…
					</div>
				)}
			</SettingsBand>

			<SellerDangerZone />
		</div>
	)
}
