'use client'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { NotificationPrefs } from '@/modules/seller/hooks/use-seller-settings'
import { SellerDangerZone } from '@/modules/seller/ui/components/settings/seller-danger-zone'
import { SettingsBand } from '@/modules/seller/ui/components/settings/settings-band'
import { SettingsPrefRow } from '@/modules/seller/ui/components/settings/settings-pref-row'

type SellerSettingsAlertsProps = {
	prefs: NotificationPrefs
	prefsReady: boolean
	prefsDirty: boolean
	isSavingPrefs: boolean
	onUpdatePref: (key: keyof NotificationPrefs, value: boolean) => void
	onSavePrefs: () => void
}
export function SellerSettingsAlerts({
	prefs,
	prefsReady,
	prefsDirty,
	isSavingPrefs,
	onUpdatePref,
	onSavePrefs,
}: SellerSettingsAlertsProps) {
	return (
		<div className='min-w-0 space-y-6'>
			<SettingsBand
				title='Notificações'
				description='Alertas da loja. Seguem a sua conta em qualquer dispositivo.'
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
						<div className='flex justify-end border-t border-border/60 px-4 py-3'>
							<Button
								size='sm'
								disabled={!prefsDirty || isSavingPrefs}
								onClick={onSavePrefs}
							>
								{isSavingPrefs
									? 'A guardar…'
									: 'Guardar preferências'}
							</Button>
						</div>
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
