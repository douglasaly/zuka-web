'use client'
import { useSellerSettings } from '@/modules/seller/hooks/use-seller-settings'
import { useSetSellerPageMeta } from '../layouts/seller-page-meta'
import { SellerSettingsAlerts } from '../sections/seller-settings-alerts'
import { SellerSettingsDestinations } from '../sections/seller-settings-destinations'
import {
	SellerSettingsLoading,
	SellerSettingsUnauth,
} from '../sections/seller-settings-gates'
import { SellerSettingsHeader } from '../sections/seller-settings-store-header'
export const SellerSettingsView = () => {
	useSetSellerPageMeta({
		title: 'Configurações',
		crumbs: ['Dashboard', 'Configurações'],
	})
	const s = useSellerSettings()
	if (s.isLoading) {
		return <SellerSettingsLoading />
	}
	if (!s.isAuthenticated || !s.profile) {
		return <SellerSettingsUnauth />
	}
	return (
		<div className='min-w-0 max-w-6xl space-y-6 pb-8'>
			<SellerSettingsHeader
				storeName={s.storeName}
				email={s.profile.email}
				storeSlug={s.store?.slug}
			/>

			<div className='grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start lg:gap-8'>
				<SellerSettingsDestinations
					can={s.can}
					storeSlug={s.store?.slug}
				/>
				<SellerSettingsAlerts
					prefs={s.prefs}
					prefsReady={s.prefsReady}
					onUpdatePref={s.updatePref}
				/>
			</div>
		</div>
	)
}
