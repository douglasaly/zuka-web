'use client'
import { Bell, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { useBrowserNotificationPermission } from '@/hooks/use-browser-notification-permission'
import type { NotificationPrefs } from '@/modules/seller/hooks/use-seller-settings'
import { SellerDangerZone } from '@/modules/seller/ui/components/settings/seller-danger-zone'
import { SettingsBand } from '@/modules/seller/ui/components/settings/settings-band'
import { SettingsPrefRow } from '@/modules/seller/ui/components/settings/settings-pref-row'

type BrowserPermissionApi = ReturnType<typeof useBrowserNotificationPermission>

type SellerSettingsAlertsProps = {
	prefs: NotificationPrefs
	prefsReady: boolean
	prefsDirty: boolean
	isSavingPrefs: boolean
	onUpdatePref: (key: keyof NotificationPrefs, value: boolean) => void
	onSavePrefs: () => void
	browserPermission: BrowserPermissionApi
	onEnableBrowserNotifications: () => void
}

function browserPermissionLabel(
	browserPermission: BrowserPermissionApi
): string {
	if (!browserPermission.ready) return 'A verificar…'
	if (!browserPermission.supported) {
		return 'Indisponível neste navegador.'
	}
	if (browserPermission.granted) {
		return 'Permitidas - alertas aparecem quando a aplicação está em segundo plano.'
	}
	if (browserPermission.denied) {
		return 'Bloqueadas - altere a permissão deste site nas definições do navegador.'
	}
	return 'Ainda não pedidas - active para receber alertas no desktop.'
}

export function SellerSettingsAlerts({
	prefs,
	prefsReady,
	prefsDirty,
	isSavingPrefs,
	onUpdatePref,
	onSavePrefs,
	browserPermission,
	onEnableBrowserNotifications,
}: SellerSettingsAlertsProps) {
	const showEnableButton =
		browserPermission.ready &&
		browserPermission.supported &&
		!browserPermission.granted

	return (
		<div className='min-w-0 space-y-6'>
			<SettingsBand
				title='Notificações'
				description='Tópicos da loja e permissão do navegador neste dispositivo.'
			>
				{prefsReady ? (
					<>
						<div className='flex min-w-0 items-start gap-3 border-b border-border/60 px-3.5 py-3.5 sm:px-4'>
							<div className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
								<Bell className='size-4' />
							</div>
							<div className='min-w-0 flex-1 space-y-2'>
								<p className='text-sm font-medium'>
									Alertas do navegador
								</p>
								<p className='text-xs leading-relaxed text-muted-foreground'>
									{browserPermissionLabel(browserPermission)}
								</p>
								{showEnableButton && (
									<Button
										type='button'
										size='sm'
										variant={
											browserPermission.denied
												? 'outline'
												: 'secondary'
										}
										disabled={browserPermission.denied}
										onClick={onEnableBrowserNotifications}
									>
										{browserPermission.denied
											? 'Bloqueadas pelo navegador'
											: 'Activar notificações do navegador'}
									</Button>
								)}
							</div>
						</div>

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
							description='Quando a loja receber uma avaliação (em breve no push)'
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
