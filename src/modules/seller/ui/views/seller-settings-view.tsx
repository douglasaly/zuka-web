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
