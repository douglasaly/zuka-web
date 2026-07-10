import { createSwaggerSpec } from 'next-swagger-doc'

const schemas = {
	ErrorResponse: {
		type: 'object',
		properties: {
			error: { type: 'string' },
			success: { type: 'boolean', nullable: true },
			message: { type: 'string', nullable: true },
		},
	},
	UserProfile: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			email: { type: 'string', nullable: true },
			firstName: { type: 'string', nullable: true },
			lastName: { type: 'string', nullable: true },
			avatarUrl: { type: 'string', nullable: true },
			phoneNumber: { type: 'string', nullable: true },
			emailVerified: { type: 'boolean', nullable: true },
			phoneVerified: { type: 'boolean', nullable: true },
			roles: { type: 'array', items: { type: 'string' } },
			sellerProfile: {
				type: 'object',
				nullable: true,
				properties: {
					id: { type: 'string' },
					status: { type: 'string' },
				},
			},
			stores: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						name: { type: 'string' },
						slug: { type: 'string' },
						status: { type: 'string', nullable: true },
						productCount: { type: 'integer' },
					},
				},
			},
			onboarding: {
				type: 'object',
				nullable: true,
				properties: {
					status: { type: 'string' },
					currentStep: { type: 'string', nullable: true },
				},
			},
		},
	},
	Product: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			name: { type: 'string' },
			price: { type: 'integer' },
			discountPrice: { type: 'integer', nullable: true },
			currency: { type: 'string' },
			status: { type: 'string' },
			isVisible: { type: 'boolean' },
			categoryName: { type: 'string', nullable: true },
			image: { type: 'string', nullable: true },
		},
	},
	Store: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			name: { type: 'string' },
			slug: { type: 'string' },
			status: { type: 'string', nullable: true },
			description: { type: 'string', nullable: true },
			logoUrl: { type: 'string', nullable: true },
			bannerUrl: { type: 'string', nullable: true },
			state: { type: 'string' },
			email: { type: 'string', nullable: true },
			phone: { type: 'string', nullable: true },
			whatsapp: { type: 'string', nullable: true },
			verified: { type: 'boolean' },
			rating: { type: 'number', format: 'float' },
			followers: { type: 'integer' },
			productCount: { type: 'integer' },
		},
	},
	Order: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			storeName: { type: 'string' },
			storeAvatar: { type: 'string', nullable: true },
			date: { type: 'string', format: 'date-time' },
			itemCount: { type: 'integer' },
			total: { type: 'integer' },
			currency: { type: 'string' },
			status: {
				type: 'string',
				enum: ['pending', 'shipping', 'completed', 'cancelled'],
			},
			statusLabel: { type: 'string' },
		},
	},
	Conversation: {
		type: 'object',
		properties: {
			conversationId: { type: 'string' },
			productId: { type: 'string', nullable: true },
			lastMessageAt: { type: 'string', format: 'date-time' },
			lastMessage: { type: 'string', nullable: true },
			isLastMessageMine: { type: 'boolean' },
			unreadCount: { type: 'integer' },
			store: {
				type: 'object',
				nullable: true,
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					logoUrl: { type: 'string', nullable: true },
					slug: { type: 'string', nullable: true },
				},
			},
		},
	},
	StoreConversation: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			otherUserName: { type: 'string' },
			otherUserAvatar: { type: 'string', nullable: true },
			lastMessage: { type: 'string', nullable: true },
			lastMessageAt: { type: 'string', nullable: true, format: 'date-time' },
			unread: { type: 'boolean' },
		},
	},
	Message: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			conversation_id: { type: 'string' },
			user_id: { type: 'string', nullable: true },
			store_id: { type: 'string', nullable: true },
			content: { type: 'string' },
			status: { type: 'string' },
			created_at: { type: 'string', format: 'date-time' },
		},
	},
	Notification: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			userId: { type: 'string' },
			type: {
				type: 'string',
				enum: [
					'message',
					'order',
					'offer',
					'follow',
					'review',
					'system',
					'promotion',
				],
			},
			title: { type: 'string' },
			body: { type: 'string' },
			link: { type: 'string', nullable: true },
			readAt: { type: 'string', nullable: true, format: 'date-time' },
			createdAt: { type: 'string', format: 'date-time' },
			sender: {
				type: 'object',
				nullable: true,
				properties: {
					type: { type: 'string', enum: ['user', 'store'] },
					id: { type: 'string' },
					name: { type: 'string' },
					avatarUrl: { type: 'string', nullable: true },
				},
			},
		},
	},
	StoreMember: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			role: { type: 'string' },
			joinedAt: { type: 'string', nullable: true, format: 'date-time' },
			invitedAt: { type: 'string', nullable: true, format: 'date-time' },
			user: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					firstName: { type: 'string', nullable: true },
					lastName: { type: 'string', nullable: true },
					email: { type: 'string', nullable: true },
					avatarUrl: { type: 'string', nullable: true },
				},
			},
		},
	},
	AdminStats: {
		type: 'object',
		properties: {
			totalUsers: { type: 'integer' },
			totalUsersPct: { type: 'number' },
			activeStores: { type: 'integer' },
			activeStoresPct: { type: 'number' },
			pendingApprovals: { type: 'integer' },
			totalProducts: { type: 'integer' },
			totalProductsPct: { type: 'number' },
			messagesToday: { type: 'integer' },
		},
	},
	UnreadCounts: {
		type: 'object',
		properties: {
			pendingOrders: { type: 'integer' },
			unreadMessages: { type: 'integer' },
		},
	},
	SellerStats: {
		type: 'object',
		properties: {
			totalSales: { type: 'integer' },
			totalSalesPrev: { type: 'integer' },
			totalSalesPct: { type: 'number' },
			totalOrders: { type: 'integer' },
			totalOrdersPrev: { type: 'integer' },
			totalOrdersPct: { type: 'number' },
			totalFollowers: { type: 'integer' },
			productCount: { type: 'integer' },
		},
	},
	SellerAnalytics: {
		type: 'object',
		properties: {
			totalSales: { type: 'integer' },
			totalOrders: { type: 'integer' },
			totalViews: { type: 'integer' },
			totalFollowers: { type: 'integer' },
			averageTicket: { type: 'integer' },
			productCount: { type: 'integer' },
		},
	},
	Category: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			parentId: { type: 'string', nullable: true },
			name: { type: 'string' },
			slug: { type: 'string' },
		},
	},
	SavedItem: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			name: { type: 'string' },
			storeName: { type: 'string' },
			price: { type: 'integer' },
			imageUrl: { type: 'string', nullable: true },
		},
	},
	PresignedUrl: {
		type: 'object',
		properties: {
			uploadUrl: { type: 'string', format: 'uri' },
			publicUrl: { type: 'string', format: 'uri' },
			key: { type: 'string' },
		},
	},
}

const paths: Record<string, any> = {
	'/api/auth/register': {
		post: {
			tags: ['Auth'],
			summary: 'Register or upsert user from Firebase token',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['token'],
							properties: {
								token: {
									type: 'string',
									description: 'Firebase ID token',
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'User created or updated',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/UserProfile',
							},
						},
					},
				},
				'401': {
					description: 'Validation failed',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse',
							},
						},
					},
				},
			},
		},
	},
	'/api/auth/session': {
		post: {
			tags: ['Auth'],
			summary: 'Create httpOnly session cookie from Firebase token',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['token'],
							properties: { token: { type: 'string' } },
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Session created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: { status: { type: 'string' } },
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/auth/logout': {
		post: {
			tags: ['Auth'],
			summary: 'Clear session cookie',
			responses: {
				'200': {
					description: 'Logged out',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: { success: { type: 'boolean' } },
							},
						},
					},
				},
			},
		},
	},
	'/api/me/profile': {
		get: {
			tags: ['Profile'],
			summary: 'Get full user profile with roles, stores, seller info',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'User profile',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean' },
									profile: {
										$ref: '#/components/schemas/UserProfile',
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		patch: {
			tags: ['Profile'],
			summary: 'Update user profile fields',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								firstName: { type: 'string' },
								lastName: { type: 'string' },
								phoneNumber: { type: 'string' },
								avatarUrl: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Profile updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: { success: { type: 'boolean' } },
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},

	'/api/categories': {
		get: {
			tags: ['Public'],
			summary: 'List all product categories',
			responses: {
				'200': {
					description: 'Category list',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/components/schemas/Category',
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/provinces': {
		get: {
			tags: ['Public'],
			summary: 'List all provinces',
			responses: {
				'200': { description: 'Province list' },
			},
		},
	},
	'/api/products': {
		get: {
			tags: ['Public'],
			summary: 'Search and filter products',
			parameters: [
				{
					name: 'categoria',
					in: 'query',
					schema: { type: 'string' },
					description: 'Category slug',
				},
				{
					name: 'search',
					in: 'query',
					schema: { type: 'string' },
					description: 'Name search',
				},
				{
					name: 'provincia',
					in: 'query',
					schema: { type: 'string' },
					description: 'Province slug',
				},
				{
					name: 'preco_min',
					in: 'query',
					schema: { type: 'integer' },
					description: 'Minimum price',
				},
				{
					name: 'preco_max',
					in: 'query',
					schema: { type: 'integer' },
					description: 'Maximum price',
				},
				{
					name: 'recente',
					in: 'query',
					schema: { type: 'string', enum: ['true'] },
					description: 'Last 14 days only',
				},
				{
					name: 'ordenar',
					in: 'query',
					schema: {
						type: 'string',
						enum: ['price_asc', 'price_desc', 'newest'],
					},
				},
				{
					name: 'page',
					in: 'query',
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: { '200': { description: 'Paginated product list' } },
		},
		post: {
			tags: ['Public'],
			summary: 'Create a new product (seller only)',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['name', 'categoryId', 'price'],
							properties: {
								name: { type: 'string' },
								description: { type: 'string' },
								categoryId: { type: 'string' },
								price: { type: 'integer' },
								discountPrice: { type: 'integer' },
								currency: { type: 'string', default: 'MZN' },
								quantity: { type: 'integer', default: 1 },
								imageUrl: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Product created' } },
		},
	},
	'/api/products/{id}': {
		get: {
			tags: ['Public'],
			summary: 'Get product details',
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': { description: 'Product with store, category, images' },
				'404': { description: 'Not found' },
			},
		},
	},
	'/api/search': {
		get: {
			tags: ['Public'],
			summary: 'Search products and stores',
			parameters: [
				{
					name: 'q',
					in: 'query',
					schema: { type: 'string' },
					description: 'Search term',
				},
				{ name: 'categoria', in: 'query', schema: { type: 'string' } },
				{ name: 'provincia', in: 'query', schema: { type: 'string' } },
				{ name: 'preco_min', in: 'query', schema: { type: 'integer' } },
				{ name: 'preco_max', in: 'query', schema: { type: 'integer' } },
				{
					name: 'recente',
					in: 'query',
					schema: { type: 'string', enum: ['true'] },
				},
				{
					name: 'ordenar',
					in: 'query',
					schema: {
						type: 'string',
						enum: [
							'relevance',
							'price_asc',
							'price_desc',
							'newest',
						],
					},
				},
			],
			responses: {
				'200': {
					description: 'Search results',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									products: {
										type: 'array',
										items: { type: 'object' },
									},
									stores: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Store',
										},
									},
									categories: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Category',
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},

	'/api/addresses': {
		get: {
			tags: ['Addresses'],
			summary: 'List user addresses',
			security: [{ CookieAuth: [] }],
			responses: { '200': { description: 'Address list' } },
		},
		post: {
			tags: ['Addresses'],
			summary: 'Create a new address',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: [
								'label',
								'street',
								'neighborhood',
								'city',
								'phone',
								'recipientName',
							],
							properties: {
								label: { type: 'string' },
								street: { type: 'string' },
								neighborhood: { type: 'string' },
								city: { type: 'string' },
								provinceSlug: { type: 'string' },
								phone: { type: 'string' },
								recipientName: { type: 'string' },
								isDefault: { type: 'boolean' },
							},
						},
					},
				},
			},
			responses: { '201': { description: 'Address created' } },
		},
	},
	'/api/addresses/{id}': {
		patch: {
			tags: ['Addresses'],
			summary: 'Update an address',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: { 'application/json': { schema: { type: 'object' } } },
			},
			responses: { '200': { description: 'Address updated' } },
		},
		delete: {
			tags: ['Addresses'],
			summary: 'Soft-delete an address',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Address deleted' } },
		},
	},

	'/api/stores': {
		get: {
			tags: ['Stores'],
			summary: 'List stores with search',
			parameters: [
				{ name: 'search', in: 'query', schema: { type: 'string' } },
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Store list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									stores: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Store',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['Stores'],
			summary: 'Create a store (seller only)',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['name', 'provinceId', 'neighborhood'],
							properties: {
								name: { type: 'string' },
								description: { type: 'string' },
								provinceId: { type: 'string' },
								categoryId: { type: 'string' },
								neighborhood: { type: 'string' },
								email: { type: 'string' },
								phone: { type: 'string' },
								whatsapp: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Store created' } },
		},
	},
	'/api/stores/{slug}': {
		get: {
			tags: ['Stores'],
			summary: 'Get store details with products',
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
				{
					name: 'page',
					in: 'query',
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 20, maximum: 50 },
				},
				{ name: 'category', in: 'query', schema: { type: 'string' } },
			],
			responses: { '200': { description: 'Store with products' } },
		},
	},
	'/api/stores/{slug}/products': {
		get: {
			tags: ['Stores'],
			summary: 'Cursor-based store products',
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
				{ name: 'cursor', in: 'query', schema: { type: 'string' } },
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 10, maximum: 20 },
				},
			],
			responses: { '200': { description: 'Paginated products' } },
		},
	},
	'/api/stores/{slug}/follow': {
		post: {
			tags: ['Stores'],
			summary: 'Follow a store',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Followed' } },
		},
		delete: {
			tags: ['Stores'],
			summary: 'Unfollow a store',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Unfollowed' } },
		},
	},
	'/api/stores/{slug}/is-following': {
		get: {
			tags: ['Stores'],
			summary: 'Check if user follows a store',
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Following status' } },
		},
	},
	'/api/stores/followed': {
		get: {
			tags: ['Stores'],
			summary: 'List followed stores',
			security: [{ CookieAuth: [] }],
			parameters: [
				{ name: 'cursor', in: 'query', schema: { type: 'string' } },
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 8 },
				},
			],
			responses: { '200': { description: 'Followed stores' } },
		},
	},

	'/api/stores/conversations': {
		get: {
			tags: ['Stores'],
			summary: 'List store conversations (seller inbox)',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Conversation list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/StoreConversation',
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
			},
		},
	},
	'/api/stores/conversations/{id}/messages': {
		get: {
			tags: ['Stores'],
			summary: 'Get messages for a store conversation',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': {
					description: 'Message list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'array',
										items: { $ref: '#/components/schemas/Message' },
									},
								},
							},
						},
					},
				},
				'404': { description: 'Conversation not found' },
			},
		},
		post: {
			tags: ['Stores'],
			summary: 'Send a message as the store',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['content'],
							properties: { content: { type: 'string' } },
						},
					},
				},
			},
			responses: {
				'201': {
					description: 'Message sent',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: { $ref: '#/components/schemas/Message' },
								},
							},
						},
					},
				},
				'404': { description: 'Conversation not found' },
			},
		},
	},
	'/api/stores/conversations/{id}/read': {
		patch: {
			tags: ['Stores'],
			summary: 'Mark a store conversation as read',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': { description: 'Marked as read' },
				'404': { description: 'Conversation not found' },
			},
		},
	},

	'/api/saved-items': {
		get: {
			tags: ['Saved Items'],
			summary: 'List saved items',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Saved items',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									items: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/SavedItem',
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/saved-items/{id}': {
		post: {
			tags: ['Saved Items'],
			summary: 'Save a product',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': { description: 'Saved' },
				'409': { description: 'Already saved' },
			},
		},
		delete: {
			tags: ['Saved Items'],
			summary: 'Remove a saved item',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '204': { description: 'Deleted (no content)' } },
		},
	},

	'/api/conversations': {
		get: {
			tags: ['Conversations'],
			summary: 'List conversations for current user',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'page',
					in: 'query',
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 10, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Conversation list',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/components/schemas/Conversation',
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['Conversations'],
			summary: 'Create a new conversation',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['productId'],
							properties: {
								productId: { type: 'string' },
								content: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '201': { description: 'Conversation created' } },
		},
	},
	'/api/conversations/{id}': {
		get: {
			tags: ['Conversations'],
			summary: 'Get conversation details',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': { description: 'Conversation with store info' },
				'403': { description: 'Forbidden' },
			},
		},
	},
	'/api/conversations/{id}/messages': {
		get: {
			tags: ['Messages'],
			summary: 'Get conversation messages',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': {
					description: 'Message list',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: { $ref: '#/components/schemas/Message' },
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['Messages'],
			summary: 'Send a message',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['content'],
							properties: { content: { type: 'string' } },
						},
					},
				},
			},
			responses: {
				'201': {
					description: 'Message sent',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Message' },
						},
					},
				},
			},
		},
	},
	'/api/conversations/{id}/read': {
		patch: {
			tags: ['Messages'],
			summary: 'Mark conversation as read',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Marked as read' } },
		},
	},

	'/api/notifications': {
		get: {
			tags: ['Notifications'],
			summary: 'List user notifications',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 20, maximum: 100 },
				},
				{
					name: 'offset',
					in: 'query',
					schema: { type: 'integer', default: 0 },
				},
			],
			responses: {
				'200': {
					description: 'Notification list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									notifications: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Notification',
										},
									},
									unreadCount: { type: 'integer' },
								},
							},
						},
					},
				},
			},
		},
		patch: {
			tags: ['Notifications'],
			summary: 'Mark notifications as read',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['ids'],
							properties: {
								ids: {
									type: 'array',
									items: { type: 'string' },
								},
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Marked as read' } },
		},
	},

	'/api/orders': {
		get: {
			tags: ['Orders'],
			summary: 'List user orders',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Order list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									orders: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Order',
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/orders/{id}': {
		get: {
			tags: ['Orders'],
			summary: 'Get order details',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Order with items' } },
		},
	},

	'/api/uploads/presign': {
		post: {
			tags: ['Uploads'],
			summary: 'Get presigned upload URL for Cloudflare R2',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['purpose', 'contentType'],
							properties: {
								purpose: {
									type: 'string',
									enum: [
										'store-logo',
										'store-banner',
										'product-image',
										'verification-id',
										'verification-selfie',
										'avatar',
									],
								},
								contentType: {
									type: 'string',
									enum: [
										'image/jpeg',
										'image/png',
										'image/webp',
									],
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Presigned URL',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/PresignedUrl',
							},
						},
					},
				},
			},
		},
	},

	'/api/seller/store': {
		patch: {
			tags: ['Seller'],
			summary: 'Update store settings',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								logoUrl: { type: 'string' },
								bannerUrl: { type: 'string' },
								description: { type: 'string' },
								phone: { type: 'string' },
								whatsapp: { type: 'string' },
								hasDelivery: { type: 'boolean' },
								currentStep: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Store updated' } },
		},
	},
	'/api/seller/products': {
		get: {
			tags: ['Seller'],
			summary: 'List seller products',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'search',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description: 'Search by product name',
				},
				{
					name: 'status',
					in: 'query',
					required: false,
					schema: { type: 'string', enum: ['all', 'draft', 'active', 'inactive'] },
				},
				{
					name: 'category',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description: 'Filter by category name',
				},
				{
					name: 'page',
					in: 'query',
					required: false,
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					required: false,
					schema: { type: 'integer', default: 20, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Product list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									products: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Product',
										},
									},
									hasMore: { type: 'boolean' },
									total: { type: 'integer' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/seller/products/{id}': {
		patch: {
			tags: ['Seller'],
			summary: 'Update a product',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								description: { type: 'string' },
								categoryId: { type: 'string' },
								price: { type: 'integer' },
								discountPrice: { type: 'integer' },
								quantity: { type: 'integer' },
								status: { type: 'string' },
								isVisible: { type: 'boolean' },
								imageUrl: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Product updated' } },
		},
		delete: {
			tags: ['Seller'],
			summary: 'Soft-delete a product',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Product deleted' } },
		},
	},
	'/api/seller/products/bulk': {
		post: {
			tags: ['Seller'],
			summary: 'Bulk action on products',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['action', 'ids'],
							properties: {
								action: {
									type: 'string',
									enum: ['delete', 'activate', 'deactivate'],
								},
								ids: {
									type: 'array',
									items: { type: 'string' },
								},
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Bulk action completed' } },
		},
	},
	'/api/seller/orders': {
		get: {
			tags: ['Seller'],
			summary: 'List seller orders',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'status',
					in: 'query',
					required: false,
					schema: { type: 'string', enum: ['all', 'pending', 'shipping', 'completed', 'cancelled'] },
				},
				{
					name: 'date',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description: 'Number of days to look back (e.g. "7", "30", "90")',
				},
				{
					name: 'page',
					in: 'query',
					required: false,
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					required: false,
					schema: { type: 'integer', default: 20, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Order list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									orders: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Order',
										},
									},
									hasMore: { type: 'boolean' },
									total: { type: 'integer' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/seller/members': {
		get: {
			tags: ['Seller'],
			summary: 'List store members',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Member list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									members: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/StoreMember',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['Seller'],
			summary: 'Invite a member to the store',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								userId: { type: 'string' },
								email: { type: 'string' },
								role: { type: 'string', default: 'staff' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Member invited' } },
		},
	},
	'/api/seller/unread-counts': {
		get: {
			tags: ['Seller'],
			summary: 'Get unread counts for sidebar badges',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Counts',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/UnreadCounts',
							},
						},
					},
				},
			},
		},
	},

	'/api/seller/stats': {
		get: {
			tags: ['Seller'],
			summary: 'Store KPIs with period comparison',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'range',
					in: 'query',
					schema: { type: 'integer', default: 30 },
					description: 'Days to look back (7, 30, 90)',
				},
			],
			responses: {
				'200': {
					description: 'KPI data',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										$ref: '#/components/schemas/SellerStats',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/seller/stats/analytics': {
		get: {
			tags: ['Seller'],
			summary: 'Analytics data for dashboard charts',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'range',
					in: 'query',
					schema: { type: 'integer', default: 30 },
					description: 'Days to look back (7, 30, 90)',
				},
			],
			responses: {
				'200': {
					description: 'Analytics data',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										$ref: '#/components/schemas/SellerAnalytics',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/seller/notifications': {
		get: {
			tags: ['Seller'],
			summary: 'List seller notifications',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 20, maximum: 100 },
				},
				{
					name: 'offset',
					in: 'query',
					schema: { type: 'integer', default: 0 },
				},
			],
			responses: {
				'200': {
					description: 'Notification list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean' },
									notifications: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Notification',
										},
									},
									unreadCount: { type: 'integer' },
								},
							},
						},
					},
				},
			},
		},
		patch: {
			tags: ['Seller'],
			summary: 'Mark seller notifications as read',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['ids'],
							properties: {
								ids: {
									type: 'array',
									items: { type: 'string' },
								},
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Marked as read' } },
		},
	},

	'/api/admin/stats': {
		get: {
			tags: ['Admin'],
			summary: 'Get admin dashboard stats',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Admin stats',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/AdminStats' },
						},
					},
				},
			},
		},
	},
	'/api/admin/analytics': {
		get: {
			tags: ['Admin'],
			summary: 'Get analytics data (signups, products, stores)',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'days',
					in: 'query',
					schema: { type: 'integer', default: 30 },
				},
			],
			responses: { '200': { description: 'Analytics data' } },
		},
	},
	'/api/admin/users': {
		get: {
			tags: ['Admin'],
			summary: 'List users with search and pagination',
			security: [{ CookieAuth: [] }],
			parameters: [
				{ name: 'search', in: 'query', schema: { type: 'string' } },
				{ name: 'status', in: 'query', schema: { type: 'string' } },
				{
					name: 'page',
					in: 'query',
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: { '200': { description: 'User list' } },
		},
	},
	'/api/admin/users/{id}': {
		get: {
			tags: ['Admin'],
			summary: 'Get user details',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'User details' } },
		},
		patch: {
			tags: ['Admin'],
			summary: 'Update user (make admin, change status)',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								makeAdmin: { type: 'boolean' },
								removeAdmin: { type: 'boolean' },
								status: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'User updated' } },
		},
		delete: {
			tags: ['Admin'],
			summary: 'Soft-delete a user',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'User deleted' } },
		},
	},
	'/api/admin/stores': {
		get: {
			tags: ['Admin'],
			summary: 'List stores with filters',
			security: [{ CookieAuth: [] }],
			parameters: [
				{ name: 'status', in: 'query', schema: { type: 'string' } },
				{ name: 'search', in: 'query', schema: { type: 'string' } },
				{
					name: 'page',
					in: 'query',
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: { '200': { description: 'Store list' } },
		},
	},
	'/api/admin/stores/{id}': {
		get: {
			tags: ['Admin'],
			summary: 'Get store details with docs and products',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': { description: 'Store with docs and products' },
			},
		},
		patch: {
			tags: ['Admin'],
			summary: 'Approve/reject store, update fields',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: { status: { type: 'string' } },
						},
					},
				},
			},
			responses: { '200': { description: 'Store updated' } },
		},
		delete: {
			tags: ['Admin'],
			summary: 'Soft-delete a store',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Store deleted' } },
		},
	},
	'/api/admin/products': {
		get: {
			tags: ['Admin'],
			summary: 'List products with filters',
			security: [{ CookieAuth: [] }],
			parameters: [
				{ name: 'search', in: 'query', schema: { type: 'string' } },
				{ name: 'category', in: 'query', schema: { type: 'string' } },
				{ name: 'status', in: 'query', schema: { type: 'string' } },
				{
					name: 'page',
					in: 'query',
					schema: { type: 'integer', default: 1 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: { '200': { description: 'Product list' } },
		},
	},
	'/api/admin/products/{id}': {
		patch: {
			tags: ['Admin'],
			summary: 'Update a product',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Product updated' } },
		},
		delete: {
			tags: ['Admin'],
			summary: 'Soft-delete a product',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: { '200': { description: 'Product deleted' } },
		},
	},
	'/api/admin/categories': {
		get: {
			tags: ['Admin'],
			summary: 'List all categories',
			security: [{ CookieAuth: [] }],
			responses: { '200': { description: 'Category list' } },
		},
		post: {
			tags: ['Admin'],
			summary: 'Create a category',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['name'],
							properties: {
								name: { type: 'string' },
								slug: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Category created' } },
		},
		patch: {
			tags: ['Admin'],
			summary: 'Update a category',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['id'],
							properties: {
								id: { type: 'string' },
								name: { type: 'string' },
								slug: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Category updated' } },
		},
		delete: {
			tags: ['Admin'],
			summary: 'Hard-delete a category',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['id'],
							properties: { id: { type: 'string' } },
						},
					},
				},
			},
			responses: { '200': { description: 'Category deleted' } },
		},
	},
	'/api/admin/notifications': {
		get: {
			tags: ['Admin'],
			summary: 'List sent notifications',
			security: [{ CookieAuth: [] }],
			responses: { '200': { description: 'Notification list' } },
		},
		post: {
			tags: ['Admin'],
			summary: 'Send notification to users',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['target', 'title', 'body'],
							properties: {
								target: {
									type: 'string',
									enum: ['buyers', 'sellers', 'all'],
								},
								title: { type: 'string' },
								body: { type: 'string' },
							},
						},
					},
				},
			},
			responses: { '200': { description: 'Notification sent' } },
		},
	},
}

export const getApiDocs = async () => {
	const spec = createSwaggerSpec({
		apiFolder: 'app/api',
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'ZUKA API',
				version: '1.0.0',
				description:
					'API de e-commerce moçambicano — documentação completa de todas as rotas.',
			},
			servers: [
				{
					url: 'http://localhost:3000',
					description: 'Desenvolvimento',
				},
				{
					url: 'https://zuka-web.vercel.app/api',
					description: 'Produção',
				},
			],
			components: {
				securitySchemes: {
					CookieAuth: {
						type: 'apiKey',
						in: 'cookie',
						name: 'zuka_session',
						description:
							'Session cookie set via POST /api/auth/session',
					},
				},
				schemas,
			},
			security: [{ CookieAuth: [] }],
			paths,
		},
	})
	return spec
}
