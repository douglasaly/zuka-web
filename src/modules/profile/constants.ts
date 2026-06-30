export const MOCK_SAVED_ITEMS = [
	{
		id: '1',
		imageUrl: '/placeholder.jpg',
		name: 'Capulana tradicional estampada',
		storeName: 'Loja da Fátima',
		price: '850 MZN',
	},
	{
		id: '2',
		imageUrl: '/placeholder.jpg',
		name: 'Colar artesanal de missangas',
		storeName: 'Artesanato Maputo',
		price: '320 MZN',
	},
	{
		id: '3',
		imageUrl: '/placeholder.jpg',
		name: 'Cesto de palha decorativo',
		storeName: 'Cestos & Cia',
		price: '450 MZN',
	},
	{
		id: '4',
		imageUrl: '/placeholder.jpg',
		name: 'Quadro pintado à mão - Baobá',
		storeName: 'Arte Local MZ',
		price: '1200 MZN',
	},
]

export const MOCK_FOLLOWED_STORES = [
	{
		id: '1',
		imageUrl: '/placeholder.jpg',
		name: 'Loja da Fátima',
		location: 'Maputo • Baixa',
		verified: true,
	},
	{
		id: '2',
		imageUrl: '/placeholder.jpg',
		name: 'Artesanato Maputo',
		location: 'Maputo • Polana',
		verified: true,
	},
	{
		id: '3',
		imageUrl: '/placeholder.jpg',
		name: 'Cestos & Cia',
		location: 'Matola • Centro',
		verified: false,
	},
]

export type SettingField = {
	id: string
	label: string
	value: string
	type: 'text' | 'email' | 'tel'
}

export const MOCK_ACCOUNT_FIELDS: SettingField[] = [
	{ id: 'firstName', label: 'Nome', value: 'Fátima', type: 'text' },
	{ id: 'lastName', label: 'Apelido', value: 'Cossa', type: 'text' },
	{
		id: 'email',
		label: 'Email',
		value: 'fatima.cossa@email.com',
		type: 'email',
	},
	{ id: 'phone', label: 'Telefone', value: '+258 84 123 4567', type: 'tel' },
]

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
	{
		id: 'priceDrops',
		title: 'Queda de preço',
		description: 'Quando um produto guardado ficar mais barato',
		enabled: false,
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
	// {
	// 	id: 'showActivity',
	// 	title: 'Mostrar atividade recente',
	// 	description: 'Permitir que outros vejam avaliações que fez',
	// 	enabled: false,
	// },
]
