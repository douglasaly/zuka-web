export type Conversation = {
	id: string
	storeName: string
	storeAvatarUrl: string
	lastMessage: string
	timestamp: string
	unreadCount: number
}

export const MOCK_CONVERSATIONS: Conversation[] = [
	{
		id: '1',
		storeName: 'Loja da Fátima',
		storeAvatarUrl: '/placeholder.jpg',
		lastMessage: 'O seu pedido já foi enviado, deve chegar amanhã.',
		timestamp: 'Ontem',
		unreadCount: 2,
	},
	{
		id: '2',
		storeName: 'Artesanato Maputo',
		storeAvatarUrl: '/placeholder.jpg',
		lastMessage: 'Obrigada pela compra! Qualquer dúvida estamos aqui.',
		timestamp: 'Ontem',
		unreadCount: 0,
	},
	{
		id: '3',
		storeName: 'Cestos & Cia',
		storeAvatarUrl: '/placeholder.jpg',
		lastMessage: 'Temos esse modelo em mais 3 cores, quer ver?',
		timestamp: '2 dias',
		unreadCount: 1,
	},
	{
		id: '4',
		storeName: 'Arte Local MZ',
		storeAvatarUrl: '/placeholder.jpg',
		lastMessage: 'Pode confirmar o endereço de entrega, por favor?',
		timestamp: '3 dias',
		unreadCount: 0,
	},
	{
		id: '5',
		storeName: 'Beleza da Ana',
		storeAvatarUrl: '/placeholder.jpg',
		lastMessage: 'O kit já está disponível para reserva.',
		timestamp: '5 dias',
		unreadCount: 0,
	},
	{
		id: '6',
		storeName: 'Capulanas & Cia',
		storeAvatarUrl: '/placeholder.jpg',
		lastMessage: 'Estamos com uma promoção esta semana, aproveite!',
		timestamp: '1 semana',
		unreadCount: 0,
	},
]

// CHAT

export type ChatMessage = {
	id: number
	sender: 'user' | 'seller'
	text: string
	time: string
}

export const MOCK_MESSAGES: ChatMessage[] = [
	{ id: 2, sender: 'user', text: 'Olá! Ainda está disponível o Samsung Galaxy A15?', time: '14:02' },
	{ id: 3, sender: 'seller', text: 'Sim, está novo na caixa.', time: '14:03' },
	{ id: 4, sender: 'user', text: 'Qual é o preço final?', time: '14:04' },
	{ id: 5, sender: 'seller', text: 'Está a 12.500 MT.', time: '14:04' },
	{ id: 6, sender: 'user', text: 'Consegue fazer por 11.000 MT?', time: '14:05' },
	{ id: 7, sender: 'seller', text: 'Posso fazer 11.800 MT.', time: '14:06' },
	{ id: 8, sender: 'user', text: 'Inclui carregador e caixa?', time: '14:06' },
	{ id: 9, sender: 'seller', text: 'Sim, tudo original incluído.', time: '14:07' },
	{ id: 10, sender: 'user', text: 'Perfeito 👍 posso ver hoje?', time: '14:07' },
	{ id: 11, sender: 'seller', text: 'Sim, estou disponível à tarde.', time: '14:08' },
	{ id: 12, sender: 'user', text: 'Onde podemos nos encontrar?', time: '14:08' },
	{ id: 13, sender: 'seller', text: 'No centro de Maputo ou Matola.', time: '14:09' },
	{ id: 14, sender: 'user', text: 'Ok, vou confirmar depois 👍', time: '14:09' },
	{ id: 15, sender: 'seller', text: 'Fico à espera 👍', time: '14:10' },
]

