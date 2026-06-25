export interface MockProduct {
	id: string
	name: string
	price: number
	currency: string
	image: string
	slug: string
	negotiable?: boolean
	hasDelivery?: boolean
	isNew?: boolean
	storeId: string
	storeName: string
	storeSlug: string
	storeLocation: string
	storeRating: number
	storeVerified?: boolean
	storeAvatar: string
	description: string
	category: string
}

export interface MockStore {
	id: string
	name: string
	slug: string
	location: string
	neighborhood: string
	verified: boolean
	rating: number
	reviewCount: number
	followers: number
	productCount: number
	bannerUrl: string
	logoUrl: string
	whatsapp: string
	phone: string
	about: string
}

export interface MockOrder {
	id: string
	storeName: string
	storeAvatar: string
	date: string
	itemCount: number
	total: number
	currency: string
	status: 'shipping' | 'pending' | 'completed' | 'cancelled'
	statusLabel: string
}

export const exploreCategories = [
	{ value: 'all', label: 'Todos' },
	{ value: 'electronics', label: 'Electrónica' },
	{ value: 'fashion', label: 'Moda' },
	{ value: 'home', label: 'Casa & Deco' },
	{ value: 'food', label: 'Alimentação' },
	{ value: 'beauty', label: 'Beleza' },
	{ value: 'footwear', label: 'Calçado' },
	{ value: 'kids', label: 'Crianças' },
]

export const mockProducts: MockProduct[] = [
	{
		id: '1',
		name: 'Smartphone Samsung Galaxy A15',
		price: 1250000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=750&fit=crop',
		slug: 'samsung-galaxy-a15',
		negotiable: true,
		hasDelivery: true,
		isNew: true,
		storeId: 'tech-maputo',
		storeName: 'Tech Maputo',
		storeSlug: 'tech-maputo',
		storeLocation: 'Maputo · Sommerschield',
		storeRating: 4.6,
		storeVerified: true,
		storeAvatar:
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
		category: 'electronics',
		description:
			'Smartphone Samsung Galaxy A15 com 4GB RAM, 128GB de armazenamento, câmara tripla de 50MP, bateria de 5000mAh e ecrã Super AMOLED de 6.5". Novo, selado com garantia oficial.',
	},
	{
		id: '2',
		name: 'Tablet Samsung Galaxy Tab A8',
		price: 1890000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop',
		slug: 'galaxy-tab-a8',
		hasDelivery: true,
		storeId: 'tech-maputo',
		storeName: 'Tech Maputo',
		storeSlug: 'tech-maputo',
		storeLocation: 'Maputo · Sommerschield',
		storeRating: 4.6,
		storeVerified: true,
		storeAvatar:
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
		category: 'electronics',
		description: 'Tablet Samsung Galaxy Tab A8 com ecrã de 10.5" e 64GB de armazenamento.',
	},
	{
		id: '3',
		name: 'T-Shirt Oversized Streetwear',
		price: 350000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop',
		slug: 'tshirt-oversized',
		negotiable: true,
		hasDelivery: true,
		storeId: 'fashion-hub',
		storeName: 'Fashion Hub',
		storeSlug: 'fashion-hub',
		storeLocation: 'Maputo · Polana',
		storeRating: 4.8,
		storeAvatar:
			'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
		category: 'fashion',
		description: 'T-shirt oversized em algodão premium, disponível em várias cores.',
	},
	{
		id: '4',
		name: 'Nike Air Force 1',
		price: 2200000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&fit=crop',
		slug: 'nike-air-force-1',
		hasDelivery: true,
		storeId: 'fashion-hub',
		storeName: 'Fashion Hub',
		storeSlug: 'fashion-hub',
		storeLocation: 'Maputo · Polana',
		storeRating: 4.8,
		storeAvatar:
			'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
		category: 'footwear',
		description: 'Ténis Nike Air Force 1 originais, tamanhos 38–44 disponíveis.',
	},
	{
		id: '5',
		name: 'Escultura Madeira Mpingo',
		price: 350000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1610701596007-de9036d1c35f?w=600&h=750&fit=crop',
		slug: 'escultura-mpingo',
		negotiable: true,
		storeId: 'artesanato-beira',
		storeName: 'Artesanato Beira',
		storeSlug: 'artesanato-beira',
		storeLocation: 'Beira · Centro',
		storeRating: 4.9,
		storeVerified: true,
		storeAvatar:
			'https://images.unsplash.com/photo-1615066390851-0f0e0c1f42f2?w=100&h=100&fit=crop',
		category: 'home',
		description:
			'Escultura artesanal em madeira de mpingo, peça única feita à mão por artesãos locais da Beira.',
	},
	{
		id: '6',
		name: 'Capulana Tradicional Premium',
		price: 850000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=750&fit=crop',
		slug: 'capulana-premium',
		negotiable: true,
		hasDelivery: true,
		storeId: 'loja-da-fatima',
		storeName: 'Loja da Fátima',
		storeSlug: 'loja-da-fatima',
		storeLocation: 'Maputo · Baixa',
		storeRating: 4.7,
		storeVerified: true,
		storeAvatar:
			'https://images.unsplash.com/photo-1596462502278-27bfdd403f7f?w=100&h=100&fit=crop',
		category: 'fashion',
		description: 'Capulana de alta qualidade com padrões tradicionais moçambicanos.',
	},
	{
		id: '7',
		name: 'Headphones Bluetooth JBL',
		price: 750000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop',
		slug: 'jbl-headphones',
		hasDelivery: true,
		storeId: 'tech-maputo',
		storeName: 'Tech Maputo',
		storeSlug: 'tech-maputo',
		storeLocation: 'Maputo · Sommerschield',
		storeRating: 4.6,
		storeVerified: true,
		storeAvatar:
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
		category: 'electronics',
		description: 'Auscultadores Bluetooth JBL com cancelamento de ruído e 30h de bateria.',
	},
	{
		id: '8',
		name: 'Vestido Chitenge Elegante',
		price: 1200000,
		currency: 'MZN',
		image:
			'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=750&fit=crop',
		slug: 'vestido-chitenge',
		negotiable: true,
		hasDelivery: true,
		storeId: 'loja-da-fatima',
		storeName: 'Loja da Fátima',
		storeSlug: 'loja-da-fatima',
		storeLocation: 'Maputo · Baixa',
		storeRating: 4.7,
		storeVerified: true,
		storeAvatar:
			'https://images.unsplash.com/photo-1596462502278-27bfdd403f7f?w=100&h=100&fit=crop',
		category: 'fashion',
		description: 'Vestido elegante confeccionado em chitenge autêntico.',
	},
]

export const mockStores: MockStore[] = [
	{
		id: 'artesanato-beira',
		name: 'Artesanato Beira',
		slug: 'artesanato-beira',
		location: 'Beira',
		neighborhood: 'Centro',
		verified: true,
		rating: 4.9,
		reviewCount: 63,
		followers: 890,
		productCount: 1,
		bannerUrl:
			'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
		logoUrl:
			'https://images.unsplash.com/photo-1615066390851-0f0e0c1f42f2?w=200&h=200&fit=crop',
		whatsapp: '+258840000000',
		phone: '+258840000000',
		about:
			'Loja de artesanato tradicional moçambicano. Peças únicas feitas à mão por artesãos locais da Beira, com foco em madeira de mpingo e tecidos tradicionais.',
	},
	{
		id: 'tech-maputo',
		name: 'Tech Maputo',
		slug: 'tech-maputo',
		location: 'Maputo',
		neighborhood: 'Sommerschield',
		verified: true,
		rating: 4.6,
		reviewCount: 128,
		followers: 2340,
		productCount: 3,
		bannerUrl:
			'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=400&fit=crop',
		logoUrl:
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
		whatsapp: '+258820000000',
		phone: '+258820000000',
		about: 'Electrónica e tecnologia com os melhores preços de Maputo.',
	},
	{
		id: 'loja-da-fatima',
		name: 'Loja da Fátima',
		slug: 'loja-da-fatima',
		location: 'Maputo',
		neighborhood: 'Baixa',
		verified: true,
		rating: 4.7,
		reviewCount: 95,
		followers: 1560,
		productCount: 2,
		bannerUrl:
			'https://images.unsplash.com/photo-1441984904996-e0b87ba5b6f7?w=1200&h=400&fit=crop',
		logoUrl:
			'https://images.unsplash.com/photo-1596462502278-27bfdd403f7f?w=200&h=200&fit=crop',
		whatsapp: '+258870000000',
		phone: '+258870000000',
		about: 'Capulanas, chitenges e moda tradicional moçambicana.',
	},
]

export const mockOrders: MockOrder[] = [
	{
		id: 'ord-1',
		storeName: 'Loja da Fátima',
		storeAvatar:
			'https://images.unsplash.com/photo-1596462502278-27bfdd403f7f?w=80&h=80&fit=crop',
		date: '10 Jun 2026',
		itemCount: 2,
		total: 2250000,
		currency: 'MZN',
		status: 'shipping',
		statusLabel: 'A caminho',
	},
	{
		id: 'ord-2',
		storeName: 'Tech Maputo',
		storeAvatar:
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop',
		date: '8 Jun 2026',
		itemCount: 1,
		total: 1250000,
		currency: 'MZN',
		status: 'pending',
		statusLabel: 'Pendente',
	},
	{
		id: 'ord-3',
		storeName: 'Fashion Hub',
		storeAvatar:
			'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop',
		date: '1 Jun 2026',
		itemCount: 3,
		total: 3800000,
		currency: 'MZN',
		status: 'completed',
		statusLabel: 'Concluído',
	},
	{
		id: 'ord-4',
		storeName: 'Artesanato Beira',
		storeAvatar:
			'https://images.unsplash.com/photo-1615066390851-0f0e0c1f42f2?w=80&h=80&fit=crop',
		date: '28 Mai 2026',
		itemCount: 1,
		total: 350000,
		currency: 'MZN',
		status: 'cancelled',
		statusLabel: 'Cancelado',
	},
]

export function getProductById(id: string) {
	return mockProducts.find((p) => p.id === id)
}

export function getStoreBySlug(slug: string) {
	return mockStores.find((s) => s.slug === slug)
}

export function getProductsByStore(slug: string) {
	return mockProducts.filter((p) => p.storeSlug === slug)
}

export function getRelatedProducts(productId: string, limit = 4) {
	const product = getProductById(productId)
	if (!product) return mockProducts.slice(0, limit)
	return mockProducts
		.filter((p) => p.id !== productId && p.category === product.category)
		.slice(0, limit)
}
