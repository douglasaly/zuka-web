export type SettingField = {
	id: string
	label: string
	value: string
	type: 'text' | 'email' | 'tel'
}

export type NotificationSettingMeta = {
	id: 'orders' | 'promotions' | 'messages'
	title: string
	description: string
}

export const BUYER_NOTIFICATION_SETTINGS: NotificationSettingMeta[] = [
	{
		id: 'orders',
		title: 'Atualizações de pedidos',
		description: 'Receba notificações sobre o estado das suas compras',
	},
	{
		id: 'promotions',
		title: 'Promoções e novidades',
		description: 'Ofertas, descontos e lançamentos de lojas que segue',
	},
	{
		id: 'messages',
		title: 'Mensagens',
		description: 'Quando uma loja lhe responder uma mensagem',
	},
]

export type PrivacySettingMeta = {
	id: 'profileVisible'
	title: string
	description: string
}

export const BUYER_PRIVACY_SETTINGS: PrivacySettingMeta[] = [
	{
		id: 'profileVisible',
		title: 'Perfil público',
		description: 'Lojas que segue podem ver o seu nome e avatar',
	},
]
