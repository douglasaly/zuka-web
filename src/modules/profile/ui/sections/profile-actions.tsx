import { Package, ShoppingBag, Store } from 'lucide-react'
import {
	getSellerPanelPath,
	isAwaitingSellerApproval,
	needsSellerOnboarding,
} from '@/lib/auth/routing'
import type { UserProfile } from '@/types/marketplace'
import { ProfileActionLink } from '../components/product-action-link'

type ProfileActionsProps = {
	profile: UserProfile
	isSeller: boolean
}

export function ProfileActions({ profile, isSeller }: ProfileActionsProps) {
	return (
		<div className='grid gap-3 sm:grid-cols-2'>
			<ProfileActionLink
				href='/feed/pedidos'
				icon={ShoppingBag}
				iconClassName='text-secondary'
				title='Os meus pedidos'
				description='Acompanhe as suas compras'
			/>

			{isSeller ? (
				<ProfileActionLink
					href={getSellerPanelPath(profile)}
					icon={Store}
					iconClassName='text-emerald-600'
					title={
						isAwaitingSellerApproval(profile)
							? 'Aguarda aprovação'
							: needsSellerOnboarding(profile)
								? 'Continuar registo da loja'
								: 'Painel do vendedor'
					}
					description={
						isAwaitingSellerApproval(profile)
							? 'A tua loja está em revisão pela equipe Zuka'
							: needsSellerOnboarding(profile)
								? 'Concluir a configuração da loja'
								: 'Gerir loja e produtos'
					}
				/>
			) : (
				<ProfileActionLink
					href='/onboarding/seller'
					icon={Package}
					iconClassName='text-emerald-600'
					title='Abrir uma loja'
					description='Publicar produtos no marketplace'
				/>
			)}
		</div>
	)
}
