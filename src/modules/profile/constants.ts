export type SettingField = {
	id: string
	label: string
	value: string
	type: 'text' | 'email' | 'tel'
}

export type NotificationSetting = {
	id: string
	title: string
	description: string
	enabled: boolean
}
export const MOCK_NOTIFICATIONS: NotificationSetting[] = [
	{
		id: 'orders',
		title: 'Atualizações de pedidos',
		description: 'Receba notificações sobre o estado das suas compras',
		enabled: true,
	},
	{
		id: 'promotions',
		title: 'Promoções e novidades',
		description: 'Ofertas, descontos e lançamentos de lojas que segue',
		enabled: true,
	},
	{
		id: 'messages',
		title: 'Mensagens',
		description: 'Quando uma loja lhe responder uma mensagem',
		enabled: true,
	},
]
export type PrivacySetting = {
	id: string
	title: string
	description: string
	enabled: boolean
}
export const MOCK_PRIVACY: PrivacySetting[] = [
	{
		id: 'profileVisible',
		title: 'Perfil público',
		description: 'Lojas que segue podem ver o seu nome e avatar',
		enabled: true,
	},
]
