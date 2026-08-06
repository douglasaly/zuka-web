import { createSwaggerSpec } from 'next-swagger-doc'

const schemas = {
	ErrorResponse: {
		type: 'object',
		properties: {
			success: { type: 'boolean', enum: [false] },
			error: {
				type: 'object',
				properties: {
					code: { type: 'string' },
					message: { type: 'string' },
				},
			},
		},
	},
	CursorPagination: {
		type: 'object',
		properties: {
			hasMore: { type: 'boolean' },
			nextCursor: { type: 'string', nullable: true },
			limit: { type: 'integer' },
		},
	},
	OffsetPagination: {
		type: 'object',
		properties: {
			total: { type: 'integer' },
			limit: { type: 'integer' },
			offset: { type: 'integer' },
			hasMore: { type: 'boolean' },
			nextCursor: { type: 'string', nullable: true },
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
			location: {
				type: 'string',
				description: 'Province name · neighborhood',
			},
			neighborhood: {
				type: 'string',
				description: 'Bairro / state field',
			},
			about: { type: 'string' },
			email: { type: 'string', nullable: true },
			phone: { type: 'string', nullable: true },
			whatsapp: { type: 'string', nullable: true },
			verified: { type: 'boolean' },
			rating: { type: 'number', format: 'float' },
			reviewCount: { type: 'integer' },
			followers: { type: 'integer' },
			productCount: { type: 'integer' },
		},
	},
	BuyerOrderItem: {
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			productId: { type: 'string', format: 'uuid', nullable: true },
			productName: { type: 'string' },
			quantity: { type: 'integer' },
			unitPrice: {
				type: 'number',
				description: 'Unit price in major currency units (MZN)',
			},
			currency: { type: 'string', example: 'MZN' },
			imageUrl: { type: 'string', nullable: true },
		},
	},
	BuyerOrderTimelineStep: {
		type: 'object',
		properties: {
			status: { type: 'string' },
			label: { type: 'string' },
			at: { type: 'string', nullable: true },
			state: {
				type: 'string',
				enum: ['done', 'current', 'upcoming'],
			},
		},
	},
	BuyerOrderProductReview: {
		type: 'object',
		properties: {
			productId: { type: 'string', format: 'uuid' },
			productName: { type: 'string' },
			imageUrl: { type: 'string', nullable: true },
			rating: { type: 'integer', minimum: 1, maximum: 5 },
			body: { type: 'string', nullable: true },
		},
	},
	BuyerOrderReview: {
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			rating: { type: 'integer', minimum: 1, maximum: 5 },
			body: { type: 'string', nullable: true },
			createdAt: { type: 'string', format: 'date-time' },
			storeReply: { type: 'string', nullable: true },
			storeRepliedAt: {
				type: 'string',
				format: 'date-time',
				nullable: true,
			},
			products: {
				type: 'array',
				items: { $ref: '#/components/schemas/BuyerOrderProductReview' },
			},
		},
	},
	Order: {
		type: 'object',
		description: 'Buyer-facing order summary (mapped from DB)',
		properties: {
			id: { type: 'string', format: 'uuid' },
			shortId: { type: 'string', description: 'First 8 chars of id, uppercased' },
			storeName: { type: 'string' },
			storeAvatar: { type: 'string', nullable: true },
			storeSlug: { type: 'string', nullable: true },
			date: {
				type: 'string',
				description: 'Human-readable PT date (e.g. "31 de julho de 2026")',
			},
			createdAt: { type: 'string', format: 'date-time' },
			itemCount: { type: 'integer' },
			total: {
				type: 'number',
				description: 'Total in major currency units (MZN)',
			},
			currency: { type: 'string', example: 'MZN' },
			status: {
				type: 'string',
				enum: ['pending', 'shipping', 'completed', 'cancelled'],
				description:
					'Buyer UI status. PENDING and CONTACTED both map to pending.',
			},
			statusLabel: { type: 'string' },
			reviewEligible: { type: 'boolean' },
			conversationId: {
				type: 'string',
				format: 'uuid',
				nullable: true,
			},
			itemsPreview: {
				type: 'array',
				description: 'Up to 3 line items for list cards',
				items: { $ref: '#/components/schemas/BuyerOrderItem' },
			},
		},
	},
	SellerOrderListItem: {
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			shortId: { type: 'string' },
			customerName: { type: 'string' },
			customerEmail: { type: 'string', nullable: true },
			itemsSummary: { type: 'string' },
			itemCount: { type: 'integer' },
			total: {
				type: 'number',
				description: 'Total in major currency units (MZN)',
			},
			currency: { type: 'string', example: 'MZN' },
			status: {
				type: 'string',
				enum: [
					'PENDING',
					'CONTACTED',
					'SHIPPING',
					'COMPLETED',
					'CANCELLED',
				],
			},
			statusLabel: { type: 'string' },
			date: { type: 'string', format: 'date-time' },
			reviewEligible: { type: 'boolean' },
			reviewState: {
				type: 'string',
				enum: ['none', 'awaiting', 'done'],
			},
			allowedActions: {
				type: 'object',
				properties: {
					markShipping: { type: 'boolean' },
					markCompleted: { type: 'boolean' },
					cancel: { type: 'boolean' },
				},
			},
		},
	},
	SellerOrderDetail: {
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			storeId: { type: 'string', format: 'uuid' },
			storeName: { type: 'string' },
			storeAvatar: { type: 'string', nullable: true },
			status: {
				type: 'string',
				enum: [
					'PENDING',
					'CONTACTED',
					'SHIPPING',
					'COMPLETED',
					'CANCELLED',
				],
			},
			statusLabel: { type: 'string' },
			total: { type: 'number' },
			currency: { type: 'string' },
			itemCount: { type: 'integer' },
			date: { type: 'string', format: 'date-time' },
			createdAt: { type: 'string', format: 'date-time' },
			updatedAt: { type: 'string', format: 'date-time', nullable: true },
			completedAt: {
				type: 'string',
				format: 'date-time',
				nullable: true,
			},
			completedBy: { type: 'string', format: 'uuid', nullable: true },
			reviewEligible: { type: 'boolean' },
			reviewState: {
				type: 'string',
				enum: ['none', 'awaiting', 'done'],
			},
			notes: { type: 'string', nullable: true },
			buyer: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid', nullable: true },
					name: { type: 'string' },
					email: { type: 'string', nullable: true },
					phone: { type: 'string', nullable: true },
					avatarUrl: { type: 'string', nullable: true },
				},
			},
			items: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						quantity: { type: 'integer' },
						unitPrice: { type: 'number' },
						currency: { type: 'string' },
						productId: {
							type: 'string',
							format: 'uuid',
							nullable: true,
						},
						productName: { type: 'string' },
						productSlug: { type: 'string', nullable: true },
					},
				},
			},
			timeline: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						status: { type: 'string' },
						label: { type: 'string' },
						at: { type: 'string', format: 'date-time' },
						note: { type: 'string' },
					},
				},
			},
		},
	},
	RatingSummary: {
		type: 'object',
		required: ['average', 'count', 'distribution'],
		properties: {
			average: { type: 'number' },
			count: { type: 'integer' },
			distribution: {
				type: 'array',
				items: { type: 'integer' },
				minItems: 5,
				maxItems: 5,
				description: 'Counts for stars 1–5',
			},
		},
	},
	SellerStoreReview: {
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			orderId: { type: 'string', format: 'uuid' },
			shortOrderId: { type: 'string' },
			buyerName: { type: 'string' },
			rating: { type: 'integer', minimum: 1, maximum: 5 },
			body: { type: 'string', nullable: true },
			storeReply: { type: 'string', nullable: true },
			storeRepliedAt: {
				type: 'string',
				format: 'date-time',
				nullable: true,
			},
			createdAt: { type: 'string', format: 'date-time' },
			products: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						productId: { type: 'string', format: 'uuid' },
						productName: { type: 'string' },
						productImage: { type: 'string', nullable: true },
						rating: { type: 'integer', minimum: 1, maximum: 5 },
						body: { type: 'string', nullable: true },
						createdAt: { type: 'string', format: 'date-time' },
					},
				},
			},
		},
	},
	SellerProductReview: {
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			reviewId: { type: 'string', format: 'uuid' },
			orderId: { type: 'string', format: 'uuid' },
			shortOrderId: { type: 'string' },
			buyerName: { type: 'string' },
			productId: { type: 'string', format: 'uuid' },
			productName: { type: 'string' },
			productImage: { type: 'string', nullable: true },
			rating: { type: 'integer', minimum: 1, maximum: 5 },
			body: { type: 'string', nullable: true },
			createdAt: { type: 'string', format: 'date-time' },
			storeReply: { type: 'string', nullable: true },
		},
	},
	ProductReviewsProduct: {
		type: 'object',
		required: [
			'id',
			'name',
			'price',
			'discountPrice',
			'currency',
			'image',
			'categoryName',
		],
		properties: {
			id: { type: 'string', format: 'uuid' },
			name: { type: 'string' },
			price: {
				type: 'number',
				description: 'Price in major currency units (MZN)',
			},
			discountPrice: {
				type: 'number',
				nullable: true,
				description: 'Promo price in major units, if any',
			},
			currency: { type: 'string', example: 'MZN' },
			image: { type: 'string', nullable: true },
			categoryName: { type: 'string', nullable: true },
		},
	},
	ProductReviewsStore: {
		type: 'object',
		required: [
			'id',
			'name',
			'slug',
			'avatarUrl',
			'verified',
			'rating',
			'reviewCount',
		],
		properties: {
			id: { type: 'string', format: 'uuid' },
			name: { type: 'string' },
			slug: { type: 'string' },
			avatarUrl: { type: 'string', nullable: true },
			verified: {
				type: 'boolean',
				description: 'True when stores.verified_at is set',
			},
			rating: {
				type: 'number',
				nullable: true,
				description: 'store_ratings.rating_avg',
			},
			reviewCount: {
				type: 'integer',
				description: 'store_ratings.rating_count',
			},
		},
	},
	PublicProductReview: {
		type: 'object',
		required: [
			'id',
			'reviewId',
			'orderId',
			'shortOrderId',
			'buyerName',
			'rating',
			'body',
			'createdAt',
			'storeReply',
			'storeRepliedAt',
		],
		properties: {
			id: {
				type: 'string',
				format: 'uuid',
				description: 'review_products.id',
			},
			reviewId: {
				type: 'string',
				format: 'uuid',
				description: 'Parent reviews.id',
			},
			orderId: { type: 'string', format: 'uuid' },
			shortOrderId: { type: 'string' },
			buyerName: {
				type: 'string',
				description: 'Partially anonymised (e.g. Maria S.)',
			},
			rating: { type: 'integer', minimum: 1, maximum: 5 },
			body: { type: 'string', nullable: true },
			createdAt: { type: 'string', format: 'date-time' },
			storeReply: { type: 'string', nullable: true },
			storeRepliedAt: {
				type: 'string',
				format: 'date-time',
				nullable: true,
			},
		},
	},
	ProductReviewsResponse: {
		type: 'object',
		required: [
			'success',
			'product',
			'store',
			'summary',
			'reviews',
			'page',
			'perPage',
			'total',
			'totalPages',
			'hasMore',
		],
		properties: {
			success: { type: 'boolean', enum: [true] },
			product: { $ref: '#/components/schemas/ProductReviewsProduct' },
			store: {
				allOf: [{ $ref: '#/components/schemas/ProductReviewsStore' }],
				nullable: true,
			},
			summary: { $ref: '#/components/schemas/RatingSummary' },
			reviews: {
				type: 'array',
				items: { $ref: '#/components/schemas/PublicProductReview' },
			},
			page: { type: 'integer', minimum: 1 },
			perPage: { type: 'integer', enum: [0, 10, 25, 50] },
			total: { type: 'integer' },
			totalPages: { type: 'integer', minimum: 1 },
			hasMore: { type: 'boolean' },
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
			lastMessageAt: {
				type: 'string',
				nullable: true,
				format: 'date-time',
			},
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
			updated_at: { type: 'string', nullable: true, format: 'date-time' },
			deleted_at: { type: 'string', nullable: true, format: 'date-time' },
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
			id: { type: 'string', format: 'uuid' },
			role: {
				type: 'string',
				enum: ['owner', 'manager', 'staff', 'viewer'],
			},
			status: {
				type: 'string',
				enum: ['pending', 'active', 'removed'],
			},
			joinedAt: { type: 'string', nullable: true, format: 'date-time' },
			invitedAt: { type: 'string', nullable: true, format: 'date-time' },
			user: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
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
	SellerStoreDocument: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			type: { type: 'string' },
			status: {
				type: 'string',
				enum: ['PENDING', 'APPROVED', 'REJECTED'],
			},
			fileUrl: { type: 'string' },
			backFileUrl: { type: 'string', nullable: true },
			rejectionReason: { type: 'string', nullable: true },
			reviewedAt: {
				type: 'string',
				nullable: true,
				format: 'date-time',
			},
			createdAt: {
				type: 'string',
				nullable: true,
				format: 'date-time',
			},
			kind: { type: 'string', nullable: true },
		},
	},
	SellerStoreDetail: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			name: { type: 'string' },
			slug: { type: 'string' },
			description: { type: 'string', nullable: true },
			logoUrl: { type: 'string', nullable: true },
			bannerUrl: { type: 'string', nullable: true },
			phone: { type: 'string', nullable: true },
			whatsapp: { type: 'string', nullable: true },
			email: { type: 'string', nullable: true },
			provinceId: { type: 'string', nullable: true },
			provinceName: { type: 'string', nullable: true },
			neighborhood: { type: 'string' },
			status: { type: 'string' },
			verifiedAt: {
				type: 'string',
				nullable: true,
				format: 'date-time',
			},
			productCount: { type: 'integer' },
			hasDelivery: { type: 'boolean' },
			deliveryFee: { type: 'integer', nullable: true },
			deliveryEtaMinutes: { type: 'integer', nullable: true },
			deliveryZones: {
				type: 'array',
				items: { type: 'string' },
			},
			documents: {
				type: 'array',
				items: { $ref: '#/components/schemas/SellerStoreDocument' },
			},
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
		required: [
			'totalSales',
			'totalOrders',
			'totalViews',
			'totalFollowers',
			'productCount',
			'changes',
			'dailySales',
		],
		properties: {
			totalSales: {
				type: 'number',
				description: 'Sales total in major currency units (MZN)',
			},
			totalOrders: { type: 'integer' },
			totalViews: { type: 'integer' },
			totalFollowers: { type: 'integer' },
			productCount: { type: 'integer' },
			changes: {
				type: 'object',
				description: 'Percent change vs previous period',
				properties: {
					totalSales: { type: 'number' },
					totalOrders: { type: 'number' },
					totalViews: { type: 'number' },
					totalFollowers: { type: 'number' },
					productCount: { type: 'number' },
				},
			},
			dailySales: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						date: { type: 'string', format: 'date' },
						sales: { type: 'number' },
					},
				},
			},
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
			description:
				'Accepts a Firebase ID token in the JSON body or via Authorization: Bearer header (mobile).',
			security: [{ BearerAuth: [] }],
			requestBody: {
				required: false,
				content: {
					'application/json': {
						schema: {
							type: 'object',
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
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/auth/delete-account': {
		post: {
			tags: ['Auth'],
			summary: 'Soft-delete current user account',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Account deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'500': {
					description: 'Deletion failed',
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
	'/api/onboarding/role': {
		post: {
			tags: ['Onboarding'],
			summary: 'Set user role during onboarding',
			security: [{ CookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['role'],
							properties: {
								role: {
									type: 'string',
									enum: ['buyer', 'seller'],
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Role assigned',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									role: { type: 'string' },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/onboarding/verification': {
		post: {
			tags: ['Onboarding'],
			summary: 'Submit identity verification documents',
			security: [{ CookieAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['idCardUrl', 'selfieUrl'],
							properties: {
								idCardUrl: {
									type: 'string',
									format: 'uri',
									description:
										'R2 public URL of ID card image',
								},
								selfieUrl: {
									type: 'string',
									format: 'uri',
									description:
										'R2 public URL of selfie image',
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Verification submitted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'400': {
					description: 'Validation error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse',
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
			},
		},
	},
	'/api/me/profile': {
		get: {
			tags: ['Profile'],
			summary: 'Get full user profile with roles, stores, seller info',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
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
	'/api/provinces': {
		get: {
			tags: ['Public'],
			summary: 'List all provinces',
			responses: {
				'200': {
					description: 'Province list',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: { type: 'string' },
										name: { type: 'string' },
										slug: { type: 'string' },
										created_at: {
											type: 'string',
											format: 'date-time',
										},
										updated_at: {
											type: 'string',
											format: 'date-time',
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
	'/api/products': {
		get: {
			tags: ['Public'],
			summary: 'Search and filter products (cursor-based)',
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
					name: 'cursor',
					in: 'query',
					schema: { type: 'string' },
					description: 'Cursor for next page (created_at value)',
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Cursor-paginated product list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'array',
										items: { type: 'object' },
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
									},
								},
							},
						},
					},
				},
			},
		},
		post: {
			tags: ['Public'],
			summary: 'Create a new product (seller only)',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
								price: { type: 'number' },
								discountPrice: { type: 'number' },
								currency: { type: 'string', default: 'MZN' },
								imageUrl: { type: 'string' },
								imageUrls: {
									type: 'array',
									items: { type: 'string' },
									maxItems: 8,
								},
								status: {
									type: 'string',
									enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
								},
							},
						},
					},
				},
			},
			responses: {
				'201': {
					description: 'Product created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											product: { type: 'object' },
										},
									},
								},
							},
						},
					},
				},
				'400': {
					description: 'Validation error',
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
				'200': {
					description: 'Product with store, category, images',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											product: { type: 'object' },
											store: {
												type: 'object',
												nullable: true,
												properties: {
													id: { type: 'string' },
													name: { type: 'string' },
													slug: { type: 'string' },
												},
											},
											category: {
												type: 'object',
												nullable: true,
												properties: {
													id: { type: 'string' },
													name: { type: 'string' },
													slug: { type: 'string' },
												},
											},
											images: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														id: { type: 'string' },
														url: { type: 'string' },
														is_primary: {
															type: 'boolean',
														},
														sort_order: {
															type: 'integer',
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
				},
				'404': {
					description: 'Not found',
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
	'/api/products/{id}/reviews': {
		get: {
			tags: ['Public'],
			summary: 'List public product reviews',
			description:
				'Paginated product reviews with rating summary and store context. Requires reviews migration. Use summaryOnly=1 for the PDP teaser (empty reviews array, perPage=0). Prices are in major currency units.',
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
					description: 'Product id',
				},
				{
					name: 'page',
					in: 'query',
					required: false,
					schema: { type: 'integer', minimum: 1, default: 1 },
					description: '1-based page index',
				},
				{
					name: 'perPage',
					in: 'query',
					required: false,
					schema: {
						type: 'integer',
						enum: [10, 25, 50],
						default: 10,
					},
					description: 'Ignored when summaryOnly=1',
				},
				{
					name: 'rating',
					in: 'query',
					required: false,
					schema: {
						type: 'integer',
						enum: [1, 2, 3, 4, 5],
					},
					description: 'Filter by exact star rating',
				},
				{
					name: 'sort',
					in: 'query',
					required: false,
					schema: {
						type: 'string',
						enum: ['recent', 'highest', 'lowest'],
						default: 'recent',
					},
				},
				{
					name: 'search',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description: 'Filter by comment body (ilike)',
				},
				{
					name: 'summaryOnly',
					in: 'query',
					required: false,
					schema: { type: 'string', enum: ['0', '1'] },
					description:
						'When 1, returns product/store/summary only (reviews=[])',
				},
			],
			responses: {
				'200': {
					description: 'Product reviews + summary',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ProductReviewsResponse',
							},
						},
					},
				},
				'400': { description: 'Missing product id' },
				'404': { description: 'Product not found' },
				'500': { description: 'Failed to load reviews' },
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
			responses: {
				'200': {
					description: 'Address list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									addresses: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												userId: { type: 'string' },
												label: { type: 'string' },
												street: { type: 'string' },
												neighborhood: {
													type: 'string',
												},
												city: { type: 'string' },
												provinceName: {
													type: 'string',
													nullable: true,
												},
												phone: { type: 'string' },
												recipientName: {
													type: 'string',
												},
												isDefault: { type: 'boolean' },
												createdAt: { type: 'string' },
												updatedAt: { type: 'string' },
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		post: {
			tags: ['Addresses'],
			summary: 'Create a new address',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'201': {
					description: 'Address created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									address: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											label: { type: 'string' },
											street: { type: 'string' },
											neighborhood: { type: 'string' },
											city: { type: 'string' },
											provinceName: {
												type: 'string',
												nullable: true,
											},
											phone: { type: 'string' },
											recipientName: { type: 'string' },
											isDefault: { type: 'boolean' },
										},
									},
								},
							},
						},
					},
				},
				'400': {
					description: 'Validation error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse',
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
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
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								label: { type: 'string' },
								street: { type: 'string' },
								neighborhood: { type: 'string' },
								city: { type: 'string' },
								provinceSlug: { type: 'string' },
								isDefault: { type: 'boolean' },
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Address updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									address: { type: 'object' },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Address not found' },
			},
		},
		delete: {
			tags: ['Addresses'],
			summary: 'Soft-delete an address',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Address deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Address not found' },
			},
		},
	},

	'/api/stores': {
		get: {
			tags: ['Stores'],
			summary: 'List stores with search and offset pagination',
			parameters: [
				{ name: 'search', in: 'query', schema: { type: 'string' } },
				{
					name: 'status',
					in: 'query',
					schema: {
						type: 'string',
						enum: ['ACTIVE', 'PENDING', 'REJECTED'],
					},
					description: 'Filter by store status',
				},
				{
					name: 'offset',
					in: 'query',
					schema: { type: 'integer', default: 0 },
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Store list with pagination',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											stores: {
												type: 'array',
												items: {
													$ref: '#/components/schemas/Store',
												},
											},
											pagination: {
												$ref: '#/components/schemas/OffsetPagination',
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
		post: {
			tags: ['Stores'],
			summary: 'Create a store (seller only)',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'201': {
					description: 'Store created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											store: { type: 'object' },
										},
									},
								},
							},
						},
					},
				},
				'400': {
					description: 'Validation error',
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
			responses: {
				'200': {
					description: 'Store with products',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											store: {
												type: 'object',
												properties: {
													id: { type: 'string' },
													name: { type: 'string' },
													slug: { type: 'string' },
													description: {
														type: 'string',
														nullable: true,
													},
													state: { type: 'string' },
													status: {
														type: 'string',
														nullable: true,
													},
													logo_url: {
														type: 'string',
														nullable: true,
													},
													banner_url: {
														type: 'string',
														nullable: true,
													},
													phone: {
														type: 'string',
														nullable: true,
													},
													whatsapp: {
														type: 'string',
														nullable: true,
													},
													email: {
														type: 'string',
														nullable: true,
													},
													verified_at: {
														type: 'string',
														nullable: true,
													},
													created_at: {
														type: 'string',
													},
													provinces: {
														type: 'object',
														properties: {
															name: {
																type: 'string',
															},
														},
													},
													product_count: {
														type: 'integer',
													},
													follower_count: {
														type: 'integer',
													},
												},
											},
											products: {
												type: 'array',
												items: { type: 'object' },
											},
											page: { type: 'integer' },
											limit: { type: 'integer' },
										},
									},
								},
							},
						},
					},
				},
				'404': { description: 'Store not found' },
			},
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
			responses: {
				'200': {
					description: 'Paginated products',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											store: {
												type: 'object',
												properties: {
													id: { type: 'string' },
													name: { type: 'string' },
													slug: { type: 'string' },
												},
											},
											products: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														id: { type: 'string' },
														name: {
															type: 'string',
														},
														slug: {
															type: 'string',
														},
														price: {
															type: 'integer',
														},
														currency: {
															type: 'string',
														},
														image: {
															type: 'string',
															nullable: true,
														},
														category: {
															type: 'object',
															nullable: true,
															properties: {
																id: {
																	type: 'string',
																},
																name: {
																	type: 'string',
																},
															},
														},
													},
												},
											},
										},
									},
									metadata: {
										type: 'object',
										properties: {
											productCount: { type: 'integer' },
										},
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/stores/{slug}/follow': {
		post: {
			tags: ['Stores'],
			summary: 'Follow a store',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': {
					description: 'Followed',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									action: {
										type: 'string',
										enum: ['followed'],
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Store not found' },
			},
		},
		delete: {
			tags: ['Stores'],
			summary: 'Unfollow a store',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'slug',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
			],
			responses: {
				'200': {
					description: 'Unfollowed',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									action: {
										type: 'string',
										enum: ['unfollowed'],
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Store not found' },
			},
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
			responses: {
				'200': {
					description: 'Following status',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									isFollowing: { type: 'boolean' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/stores/followed': {
		get: {
			tags: ['Stores'],
			summary: 'List followed stores',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{ name: 'cursor', in: 'query', schema: { type: 'string' } },
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 8 },
				},
			],
			responses: {
				'200': {
					description: 'Followed stores',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												followed_at: {
													type: 'string',
													nullable: true,
												},
												store: {
													type: 'object',
													properties: {
														id: { type: 'string' },
														name: {
															type: 'string',
														},
														logo_url: {
															type: 'string',
															nullable: true,
														},
														slug: {
															type: 'string',
														},
														state: {
															type: 'string',
														},
														verified_at: {
															type: 'string',
															nullable: true,
														},
														province: {
															type: 'object',
															properties: {
																name: {
																	type: 'string',
																},
															},
														},
													},
												},
											},
										},
									},
									metaData: {
										type: 'object',
										properties: {
											total: { type: 'integer' },
											limit: { type: 'integer' },
											nextCursor: {
												type: 'string',
												nullable: true,
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},

	'/api/stores/conversations': {
		get: {
			tags: ['Stores'],
			summary: 'List store conversations (seller inbox, cursor-based)',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'cursor',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'last_message_at cursor from previous page (ISO timestamp)',
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
					description: 'Conversation list with cursor pagination',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/StoreConversation',
										},
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
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
			summary:
				'Get messages for a store conversation (cursor-based, latest first)',
			description:
				'Returns the newest messages first. Pass cursor (oldest created_at from the current window) to load older messages.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
				{
					name: 'cursor',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'created_at of the oldest loaded message (ISO timestamp)',
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
					description: 'Message list with cursor pagination',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Message',
										},
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
									success: { type: 'boolean', enum: [true] },
									data: {
										$ref: '#/components/schemas/Message',
									},
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			summary: 'List buyer inbox conversations (cursor-based)',
			description:
				'Returns conversations where the current user is a participant as a buyer. Excludes conversations for stores the user owns or belongs to as an active member — those belong to the seller dashboard (`/api/stores/conversations`).',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'cursor',
					in: 'query',
					schema: { type: 'string' },
					description: 'Cursor for next page (last_message_at value)',
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 20, maximum: 100 },
				},
			],
			responses: {
				'200': {
					description: 'Buyer conversation list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Conversation',
										},
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		post: {
			tags: ['Conversations'],
			summary: 'Create or reuse a buyer conversation with a store',
			description:
				'Opens the existing conversation between the current user and the product\'s store (one thread per buyer+store). Creates a new conversation only if none exists. Soft-deleted threads are revived. Updates `product_id` to the product that triggered the open. Forbidden when the product belongs to a store the user owns or manages.',
			security: [{ CookieAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['productId'],
							properties: {
								productId: { type: 'string' },
								content: {
									type: 'string',
									description:
										'Optional initial message content',
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Existing conversation reused (and optionally revived)',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											conversationId: { type: 'string' },
										},
									},
								},
							},
						},
					},
				},
				'201': {
					description: 'New conversation created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'object',
										properties: {
											conversationId: { type: 'string' },
										},
									},
								},
							},
						},
					},
				},
				'400': {
					description: 'Validation error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse',
							},
						},
					},
				},
				'403': {
					description:
						'Cannot start a buyer conversation with a store you own or manage',
				},
				'404': { description: 'Product not found' },
			},
		},
	},
	'/api/conversations/{id}': {
		get: {
			tags: ['Conversations'],
			summary: 'Get buyer conversation details',
			description:
				'Returns conversation details for the buyer view. Forbidden when the conversation belongs to a store the user owns or manages (use seller dashboard APIs).',
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
					description: 'Conversation with store info',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'object',
										properties: {
											conversationId: { type: 'string' },
											productId: {
												type: 'string',
												nullable: true,
											},
											store: {
												type: 'object',
												properties: {
													id: { type: 'string' },
													name: { type: 'string' },
													logoUrl: {
														type: 'string',
														nullable: true,
													},
													slug: { type: 'string' },
													state: { type: 'string' },
													provinceName: {
														type: 'string',
														nullable: true,
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
				'401': { description: 'Unauthorized' },
				'403': {
					description:
						'Not a participant, or conversation belongs to a managed store (use seller dashboard)',
				},
				'404': { description: 'Not found' },
			},
		},
	},
	'/api/conversations/{id}/messages': {
		get: {
			tags: ['Messages'],
			summary: 'Get buyer conversation messages (cursor-based)',
			description:
				'Buyer-view messages only. Forbidden for conversations of stores the user owns or manages — use `/api/stores/conversations/{id}/messages`.',
			security: [{ CookieAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string' },
				},
				{
					name: 'cursor',
					in: 'query',
					schema: { type: 'string' },
					description: 'Cursor for next page (created_at value)',
				},
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 50, maximum: 100 },
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
									success: { type: 'boolean', enum: [true] },
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Message',
										},
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
									},
								},
							},
						},
					},
				},
				'403': {
					description:
						'Not a participant, or conversation belongs to a managed store',
				},
				'404': { description: 'Conversation not found' },
			},
		},
		post: {
			tags: ['Messages'],
			summary: 'Send a buyer message',
			description:
				'Sends a message as the buyer (`store_id` null). Forbidden for conversations of stores the user owns or manages — use `/api/stores/conversations/{id}/messages`.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
									success: { type: 'boolean', enum: [true] },
									data: {
										$ref: '#/components/schemas/Message',
									},
								},
							},
						},
					},
				},
				'400': {
					description: 'Validation error',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse',
							},
						},
					},
				},
				'403': {
					description:
						'Not a participant, or conversation belongs to a managed store',
				},
			},
		},
	},
	'/api/conversations/{id}/read': {
		patch: {
			tags: ['Messages'],
			summary: 'Mark buyer conversation as read',
			description:
				'Updates `last_read_at` for the current user. Forbidden when the conversation belongs to a store the user owns or manages.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Marked as read',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': {
					description:
						'Conversation belongs to a managed store (use seller dashboard)',
				},
			},
		},
	},

	'/api/notifications': {
		get: {
			tags: ['Notifications'],
			summary: 'List user notifications',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			summary: 'List authenticated buyer orders',
			description:
				'Cursor-paginated list of orders for the logged-in buyer. Also returns status counts, distinct store names for filters, and up to 5 completed orders awaiting review.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'status',
					in: 'query',
					required: false,
					schema: {
						type: 'string',
						enum: [
							'all',
							'pending',
							'shipping',
							'completed',
							'cancelled',
						],
						default: 'all',
					},
					description:
						'Buyer UI status filter. pending includes PENDING and CONTACTED.',
				},
				{
					name: 'period',
					in: 'query',
					required: false,
					schema: {
						type: 'string',
						enum: ['all', '7', '30', '90'],
						default: 'all',
					},
					description:
						'Look-back window in days. "all" disables the date filter.',
				},
				{
					name: 'store',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'Exact store name filter. Omit or pass "all" for every store.',
				},
				{
					name: 'cursor',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'Cursor for next page (previous page last created_at ISO value)',
				},
				{
					name: 'limit',
					in: 'query',
					required: false,
					schema: {
						type: 'integer',
						minimum: 1,
						maximum: 100,
						default: 5,
					},
				},
			],
			responses: {
				'200': {
					description: 'Cursor-paginated buyer order list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: [
									'success',
									'data',
									'pagination',
									'counts',
									'stores',
									'pendingReviews',
								],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									data: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Order',
										},
									},
									pagination: {
										$ref: '#/components/schemas/CursorPagination',
									},
									counts: {
										type: 'object',
										properties: {
											all: { type: 'integer' },
											pending: { type: 'integer' },
											shipping: { type: 'integer' },
											completed: { type: 'integer' },
											cancelled: { type: 'integer' },
											reviewEligible: {
												type: 'integer',
												description:
													'COMPLETED orders with review_eligible=true',
											},
										},
									},
									stores: {
										type: 'array',
										items: { type: 'string' },
										description:
											'Distinct store names from the buyer orders (sorted pt)',
									},
									pendingReviews: {
										type: 'array',
										description:
											'Up to 5 completed, review-eligible orders (newest completed first)',
										items: {
											$ref: '#/components/schemas/Order',
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'500': { description: 'Failed to load orders' },
			},
		},
	},
	'/api/orders/{id}': {
		get: {
			tags: ['Orders'],
			summary: 'Get buyer order details',
			description:
				'Returns mapped order summary, full line items, derived status timeline, notes, and existing store/product review when present. Ownership enforced against the authenticated buyer.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
				},
			],
			responses: {
				'200': {
					description: 'Buyer order detail',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: [
									'success',
									'order',
									'items',
									'timeline',
									'notes',
									'review',
									'storeSlug',
								],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									order: {
										$ref: '#/components/schemas/Order',
									},
									items: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/BuyerOrderItem',
										},
									},
									timeline: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/BuyerOrderTimelineStep',
										},
									},
									notes: {
										type: 'string',
										nullable: true,
									},
									review: {
										nullable: true,
										allOf: [
											{
												$ref: '#/components/schemas/BuyerOrderReview',
											},
										],
									},
									storeSlug: {
										type: 'string',
										nullable: true,
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Order not found' },
				'500': { description: 'Failed to load order' },
			},
		},
	},
	'/api/orders/{id}/review': {
		post: {
			tags: ['Orders'],
			summary: 'Submit store and product reviews for a completed order',
			description:
				'Creates a store-level review and nested product reviews for a COMPLETED, review-eligible order owned by the authenticated buyer. All order products must be rated. A DB trigger sets orders.review_eligible=false after insert.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
					description: 'Order id',
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['storeRating', 'products'],
							properties: {
								storeRating: {
									type: 'integer',
									minimum: 1,
									maximum: 5,
								},
								storeBody: {
									type: 'string',
									nullable: true,
									maxLength: 2000,
								},
								products: {
									type: 'array',
									minItems: 1,
									items: {
										type: 'object',
										required: ['productId', 'rating'],
										properties: {
											productId: {
												type: 'string',
												format: 'uuid',
											},
											rating: {
												type: 'integer',
												minimum: 1,
												maximum: 5,
											},
											body: {
												type: 'string',
												nullable: true,
												maxLength: 2000,
											},
										},
									},
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Review created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['success', 'reviewId'],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									reviewId: {
										type: 'string',
										format: 'uuid',
									},
								},
							},
						},
					},
				},
				'400': {
					description:
						'Invalid payload, order not completed, or missing product ratings',
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Order not found' },
				'409': {
					description: 'Order already reviewed / not review-eligible',
				},
				'500': { description: 'Failed to submit review' },
			},
		},
	},

	'/api/uploads/presign': {
		post: {
			tags: ['Uploads'],
			summary: 'Get presigned upload URL for Cloudflare R2',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
		get: {
			tags: ['Seller'],
			summary: 'Get seller store settings',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			responses: {
				'200': {
					description: 'Seller store detail',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									store: {
										$ref: '#/components/schemas/SellerStoreDetail',
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'404': { description: 'Store not found' },
			},
		},
		patch: {
			tags: ['Seller'],
			summary: 'Update store settings',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								slug: { type: 'string' },
								logoUrl: { type: 'string', nullable: true },
								bannerUrl: { type: 'string', nullable: true },
								description: { type: 'string', nullable: true },
								phone: { type: 'string', nullable: true },
								whatsapp: { type: 'string', nullable: true },
								email: { type: 'string', nullable: true },
								provinceId: { type: 'string', nullable: true },
								neighborhood: { type: 'string' },
								status: {
									type: 'string',
									enum: ['ACTIVE', 'INACTIVE'],
								},
								hasDelivery: { type: 'boolean' },
								deliveryFee: { type: 'integer', nullable: true },
								deliveryEtaMinutes: {
									type: 'integer',
									nullable: true,
								},
								deliveryZones: {
									type: 'array',
									items: { type: 'string' },
								},
								currentStep: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Store updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									store: {
										$ref: '#/components/schemas/SellerStoreDetail',
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'404': { description: 'Store not found' },
			},
		},
	},
	'/api/seller/store/documents': {
		post: {
			tags: ['Seller'],
			summary: 'Submit or resubmit seller verification documents',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['idCardUrl', 'selfieUrl'],
							properties: {
								idCardUrl: { type: 'string' },
								selfieUrl: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Documents submitted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									documents: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/SellerStoreDocument',
										},
									},
								},
							},
						},
					},
				},
				'400': { description: 'Invalid input or documents already approved' },
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'404': { description: 'Store not found' },
			},
		},
	},
	'/api/seller/products': {
		get: {
			tags: ['Seller'],
			summary: 'List seller products',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					schema: {
						type: 'string',
						enum: [
							'all',
							'DRAFT',
							'ACTIVE',
							'INACTIVE',
						],
					},
				},
				{
					name: 'category',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description: 'Filter by category id',
				},
				{
					name: 'minPrice',
					in: 'query',
					required: false,
					schema: { type: 'number' },
					description: 'Minimum price in MZN',
				},
				{
					name: 'maxPrice',
					in: 'query',
					required: false,
					schema: { type: 'number' },
					description: 'Maximum price in MZN',
				},
				{
					name: 'page',
					in: 'query',
					required: false,
					schema: { type: 'integer', minimum: 1, default: 1 },
					description: '1-based page index for traditional pagination',
				},
				{
					name: 'perPage',
					in: 'query',
					required: false,
					schema: {
						type: 'integer',
						enum: [10, 25, 50, 100],
						default: 20,
					},
					description:
						'Items per page. Alias: limit (same values, max 100).',
				},
				{
					name: 'limit',
					in: 'query',
					required: false,
					deprecated: true,
					schema: { type: 'integer', default: 20, maximum: 100 },
					description: 'Deprecated alias for perPage',
				},
			],
			responses: {
				'200': {
					description: 'Paginated product list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: [
									'success',
									'products',
									'page',
									'perPage',
									'total',
									'totalPages',
									'hasMore',
								],
								properties: {
									success: { type: 'boolean', enum: [true] },
									products: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												name: { type: 'string' },
												description: {
													type: 'string',
													nullable: true,
												},
												price: { type: 'number' },
												discountPrice: {
													type: 'number',
													nullable: true,
												},
												currency: { type: 'string' },
												status: { type: 'string' },
												isVisible: { type: 'boolean' },
												categoryName: {
													type: 'string',
													nullable: true,
												},
												image: {
													type: 'string',
													nullable: true,
												},
												images: {
													type: 'array',
													items: { type: 'string' },
												},
											},
										},
									},
									store: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											name: { type: 'string' },
											slug: { type: 'string' },
										},
									},
									page: { type: 'integer' },
									perPage: { type: 'integer' },
									total: { type: 'integer' },
									totalPages: { type: 'integer' },
									hasMore: { type: 'boolean' },
								},
							},
						},
					},
				},
			},
		},
	},
	'/api/seller/products/{id}': {
		get: {
			tags: ['Seller'],
			summary: 'Get seller product detail for editing',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Product detail',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									product: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											name: { type: 'string' },
											description: {
												type: 'string',
												nullable: true,
											},
											categoryId: { type: 'string' },
											categoryName: {
												type: 'string',
												nullable: true,
											},
											price: { type: 'number' },
											discountPrice: {
												type: 'number',
												nullable: true,
											},
											currency: { type: 'string' },
											status: { type: 'string' },
											isVisible: { type: 'boolean' },
											images: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														id: { type: 'string' },
														url: { type: 'string' },
														position: {
															type: 'integer',
														},
														isPrimary: {
															type: 'boolean',
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
				},
				'404': { description: 'Product not found' },
			},
		},
		patch: {
			tags: ['Seller'],
			summary: 'Update a product',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
								price: { type: 'number' },
								discountPrice: {
									type: 'number',
									nullable: true,
								},
								status: {
									type: 'string',
									enum: [
										'DRAFT',
										'ACTIVE',
										'INACTIVE',
									],
								},
								isVisible: { type: 'boolean' },
								imageUrl: { type: 'string' },
								imageUrls: {
									type: 'array',
									items: { type: 'string' },
									maxItems: 8,
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Product updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Product not found' },
			},
		},
		delete: {
			tags: ['Seller'],
			summary: 'Soft-delete a product',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Product deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/seller/products/bulk': {
		post: {
			tags: ['Seller'],
			summary: 'Bulk action on products',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'Bulk action completed',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									affected: { type: 'integer' },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/seller/categories': {
		get: {
			tags: ['Seller'],
			summary: 'List categories for seller management',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			responses: {
				'200': {
					description: 'Category list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									categories: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												parentId: {
													type: 'string',
													nullable: true,
												},
												name: { type: 'string' },
												slug: { type: 'string' },
												position: { type: 'integer' },
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
		post: {
			tags: ['Seller'],
			summary: 'Create category',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['name'],
							properties: {
								name: { type: 'string' },
								slug: { type: 'string' },
								parentId: {
									type: 'string',
									nullable: true,
								},
							},
						},
					},
				},
			},
			responses: {
				'200': { description: 'Category created' },
				'400': { description: 'Validation error' },
			},
		},
		patch: {
			tags: ['Seller'],
			summary: 'Update category or reorder categories',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			requestBody: {
				content: {
					'application/json': {
						schema: {
							oneOf: [
								{
									type: 'object',
									required: ['id'],
									properties: {
										id: { type: 'string' },
										name: { type: 'string' },
										slug: { type: 'string' },
										parentId: {
											type: 'string',
											nullable: true,
										},
										position: { type: 'integer' },
									},
								},
								{
									type: 'object',
									required: ['items'],
									properties: {
										items: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													id: { type: 'string' },
													position: {
														type: 'integer',
													},
													parentId: {
														type: 'string',
														nullable: true,
													},
												},
											},
										},
									},
								},
							],
						},
					},
				},
			},
			responses: {
				'200': { description: 'Category updated' },
			},
		},
		delete: {
			tags: ['Seller'],
			summary: 'Soft-delete category',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['id'],
							properties: {
								id: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				'200': { description: 'Category deleted' },
				'400': {
					description: 'Category still has products',
				},
			},
		},
	},
	'/api/seller/orders': {
		get: {
			tags: ['Seller'],
			summary: 'List orders for the authenticated seller store',
			description:
				'Multi-tenant: returns only orders belonging to the logged-in store. Linear status flow: PENDING → SHIPPING → COMPLETED (CANCELLED stops the flow).',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'status',
					in: 'query',
					required: false,
					schema: {
						type: 'string',
						enum: [
							'all',
							'PENDING',
							'CONTACTED',
							'SHIPPING',
							'COMPLETED',
							'CANCELLED',
						],
						default: 'all',
					},
				},
				{
					name: 'date',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'Number of days to look back (e.g. "7", "30", "90")',
				},
				{
					name: 'search',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'Filter by order id, short id, customer name/email, or items summary. When set, matching is applied then the result is paginated (total reflects filtered count).',
				},
				{
					name: 'page',
					in: 'query',
					required: false,
					schema: { type: 'integer', minimum: 1, default: 1 },
					description: '1-based page index for traditional pagination',
				},
				{
					name: 'perPage',
					in: 'query',
					required: false,
					schema: {
						type: 'integer',
						enum: [10, 25, 50, 100],
						default: 10,
					},
					description:
						'Items per page. Alias: limit (same values, max 100).',
				},
				{
					name: 'limit',
					in: 'query',
					required: false,
					deprecated: true,
					schema: { type: 'integer', default: 10, maximum: 100 },
					description: 'Deprecated alias for perPage',
				},
			],
			responses: {
				'200': {
					description: 'Paginated order list for the store',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: [
									'success',
									'orders',
									'page',
									'perPage',
									'total',
									'totalPages',
								],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									orders: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/SellerOrderListItem',
										},
									},
									page: {
										type: 'integer',
										minimum: 1,
										description: 'Current page (1-based)',
									},
									perPage: {
										type: 'integer',
										enum: [10, 25, 50, 100],
									},
									total: {
										type: 'integer',
										description:
											'Total orders matching filters/search',
									},
									totalPages: {
										type: 'integer',
										minimum: 1,
									},
									hasMore: {
										type: 'boolean',
										description:
											'True when page < totalPages',
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
	'/api/seller/orders/{id}': {
		get: {
			tags: ['Seller'],
			summary: 'Get seller order detail',
			description:
				'Returns order detail with buyer, line items, and derived status timeline. Ownership is enforced against the authenticated store.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
				},
			],
			responses: {
				'200': {
					description: 'Order detail',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									order: {
										$ref: '#/components/schemas/SellerOrderDetail',
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'404': {
					description: 'Order not found for this store',
				},
			},
		},
		patch: {
			tags: ['Seller'],
			summary: 'Update seller order status',
			description:
				'Allowed transitions: PENDING|CONTACTED → SHIPPING|CANCELLED; SHIPPING → COMPLETED|CANCELLED. Mark as delivered = status COMPLETED (only from SHIPPING). Completing sets completed_at/completed_by, review_eligible=true, and inserts a review notification for the buyer. Idempotent when status is unchanged.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['status'],
							properties: {
								status: {
									type: 'string',
									enum: [
										'PENDING',
										'CONTACTED',
										'SHIPPING',
										'COMPLETED',
										'CANCELLED',
									],
									description:
										'COMPLETED = marcar como entregue (irreversível)',
								},
								notes: {
									type: 'string',
									description:
										'Optional note (e.g. cancel reason)',
								},
							},
						},
						examples: {
							markDelivered: {
								summary: 'Marcar como entregue',
								value: { status: 'COMPLETED' },
							},
							markShipping: {
								summary: 'Marcar como em envio',
								value: { status: 'SHIPPING' },
							},
							cancel: {
								summary: 'Cancelar pedido',
								value: {
									status: 'CANCELLED',
									notes: 'Cliente pediu cancelamento',
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description:
						'Updated order. On COMPLETED, buyer receives review notification.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									order: {
										$ref: '#/components/schemas/SellerOrderDetail',
									},
									idempotent: {
										type: 'boolean',
										description:
											'True when status was already the requested value',
									},
								},
							},
						},
					},
				},
				'400': { description: 'Invalid status' },
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'404': {
					description: 'Order not found for this store',
				},
				'409': {
					description:
						'Transition not allowed (e.g. COMPLETED from PENDING, or from CANCELLED)',
				},
			},
		},
	},
	'/api/seller/reviews': {
		get: {
			tags: ['Seller'],
			summary: 'List store and product reviews for the seller',
			description:
				'Returns rating summary plus store-level reviews (with nested product reviews) and a flattened product-reviews list. Requires reviews migration applied. Generated Supabase Database types may lag — routes use an untyped admin client.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'scope',
					in: 'query',
					required: false,
					schema: {
						type: 'string',
						enum: ['all', 'store', 'product'],
						default: 'all',
					},
					description:
						'When store|product, the other list is returned empty. UI typically requests all and filters client-side by tab.',
				},
				{
					name: 'search',
					in: 'query',
					required: false,
					schema: { type: 'string' },
					description:
						'Filter by buyer name, short order id, comment, or product name',
				},
				{
					name: 'needsReply',
					in: 'query',
					required: false,
					schema: { type: 'string', enum: ['0', '1'] },
					description:
						'When 1, only store reviews without store_reply',
				},
			],
			responses: {
				'200': {
					description: 'Reviews + summary for the authenticated store',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: [
									'success',
									'summary',
									'storeReviews',
									'productReviews',
								],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									summary: {
										type: 'object',
										properties: {
											store: {
												$ref: '#/components/schemas/RatingSummary',
											},
											products: {
												$ref: '#/components/schemas/RatingSummary',
											},
										},
									},
									storeReviews: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/SellerStoreReview',
										},
									},
									productReviews: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/SellerProductReview',
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'500': { description: 'Failed to load reviews' },
			},
		},
	},
	'/api/seller/reviews/{id}/reply': {
		post: {
			tags: ['Seller'],
			summary: 'Reply to a store review',
			description:
				'Sets store_reply / store_replied_at on a review owned by the authenticated store. Fails with 409 if a reply already exists.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
					description: 'Review id (store-level reviews.id)',
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['reply'],
							properties: {
								reply: {
									type: 'string',
									minLength: 1,
									maxLength: 2000,
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Reply saved',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['success', 'reply', 'repliedAt'],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									reply: { type: 'string' },
									repliedAt: {
										type: 'string',
										format: 'date-time',
									},
								},
							},
						},
					},
				},
				'400': { description: 'Empty or too-long reply' },
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'404': { description: 'Review not found for this store' },
				'409': { description: 'Review already has a reply' },
				'500': { description: 'Failed to save reply' },
			},
		},
	},
	'/api/seller/members': {
		get: {
			tags: ['Seller'],
			summary: 'List store members',
			description:
				'Lists active/pending members for the authenticated store. Requires member.read. Response includes me.canManage (member.manage) and roleCatalog from RBAC.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			responses: {
				'200': {
					description: 'Member list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['members'],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									members: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/StoreMember',
										},
									},
									me: {
										type: 'object',
										properties: {
											userId: {
												type: 'string',
												format: 'uuid',
												description:
													'Current authenticated user id (for “Você” UI)',
											},
											memberRole: { type: 'string' },
											rbacRole: { type: 'string' },
											isOwner: { type: 'boolean' },
											permissions: {
												type: 'array',
												items: { type: 'string' },
											},
											canManage: { type: 'boolean' },
										},
									},
									roleCatalog: {
										type: 'object',
										additionalProperties: {
											type: 'object',
											properties: {
												label: { type: 'string' },
												summary: { type: 'string' },
												permissions: {
													type: 'array',
													items: { type: 'string' },
												},
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Missing member.read' },
				'500': { description: 'Failed to load members' },
			},
		},
		post: {
			tags: ['Seller'],
			summary: 'Invite a member to the store',
			description:
				'Requires member.manage. Adds an existing Zuka user by email or userId (roles: manager|staff|viewer → store_* via role_permissions). Soft-deleted memberships are revived. On success, inserts a system notification for the invitee (sender_store_id = store; link /dashboard/seller). Notification failures are logged and do not fail the invite.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								userId: {
									type: 'string',
									format: 'uuid',
								},
								email: { type: 'string', format: 'email' },
								role: {
									type: 'string',
									enum: ['manager', 'staff', 'viewer'],
									default: 'staff',
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description:
						'Member invited or revived; invitee notified (best-effort)',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									revived: {
										type: 'boolean',
										description:
											'True when a soft-deleted membership was restored',
									},
								},
							},
						},
					},
				},
				'400': { description: 'Validation error' },
				'401': { description: 'Unauthorized' },
				'403': { description: 'Missing member.manage' },
				'404': { description: 'User not found' },
				'409': { description: 'Already a member' },
				'500': { description: 'Failed to invite' },
			},
		},
	},
	'/api/seller/access': {
		get: {
			tags: ['Seller'],
			summary: 'Current store access and permissions',
			description:
				'Returns the caller store context, RBAC permissions (from role_permissions), and roleCatalog for UI gating.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			responses: {
				'200': {
					description: 'Access payload',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									store: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											name: { type: 'string' },
											slug: { type: 'string' },
										},
									},
									memberRole: { type: 'string' },
									rbacRole: { type: 'string' },
									isOwner: { type: 'boolean' },
									permissions: {
										type: 'array',
										items: { type: 'string' },
									},
									roleCatalog: { type: 'object' },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'No store access' },
			},
		},
	},
	'/api/seller/members/{id}': {
		patch: {
			tags: ['Seller'],
			summary: 'Update a store member role',
			description:
				'Requires member.manage. Cannot change the store owner. Role maps to store_* RBAC via role_permissions.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['role'],
							properties: {
								role: {
									type: 'string',
									enum: ['manager', 'staff', 'viewer'],
								},
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Role updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									role: { type: 'string' },
								},
							},
						},
					},
				},
				'400': { description: 'Invalid role' },
				'401': { description: 'Unauthorized' },
				'403': {
					description: 'Missing member.manage or cannot change owner',
				},
				'404': { description: 'Member not found' },
				'500': { description: 'Failed to update role' },
			},
		},
		delete: {
			tags: ['Seller'],
			summary: 'Remove a store member (soft delete)',
			description:
				'Requires member.manage. Soft-deletes the membership (status removed). Cannot remove the store owner.',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'string', format: 'uuid' },
				},
			],
			responses: {
				'200': {
					description: 'Member removed',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': {
					description: 'Missing member.manage or cannot remove owner',
				},
				'404': { description: 'Member not found' },
				'500': { description: 'Failed to remove member' },
			},
		},
	},
	'/api/seller/unread-counts': {
		get: {
			tags: ['Seller'],
			summary: 'Get unread counts for sidebar badges',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			summary: 'Store performance metrics for the seller analytics page',
			description:
				'Currently returns mock data (mock: true). No averageTicket. Range accepts 7d|30d|90d (or numeric days).',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'range',
					in: 'query',
					required: false,
					schema: {
						type: 'string',
						enum: ['7d', '30d', '90d'],
						default: '30d',
					},
					description: 'Lookback period. Numeric 7/30/90 also accepted.',
				},
			],
			responses: {
				'200': {
					description: 'Performance metrics (often mock)',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['success', 'mock', 'range', 'data'],
								properties: {
									success: {
										type: 'boolean',
										enum: [true],
									},
									mock: {
										type: 'boolean',
										description:
											'True while view tracking is not live',
									},
									range: {
										type: 'string',
										enum: ['7d', '30d', '90d'],
									},
									data: {
										$ref: '#/components/schemas/SellerAnalytics',
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'403': { description: 'Not a seller' },
				'500': { description: 'Failed to load performance' },
			},
		},
	},
	'/api/seller/stats/daily': {
		get: {
			tags: ['Seller'],
			summary: 'Daily sales for the last N days (chart data)',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'days',
					in: 'query',
					schema: { type: 'integer', default: 7, minimum: 7, maximum: 30 },
					description: 'Number of days to return',
				},
			],
			responses: {
				'200': {
					description: 'Daily sales array',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												date: { type: 'string', format: 'date' },
												sales: { type: 'number' },
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/seller/stats/top-products': {
		get: {
			tags: ['Seller'],
			summary: 'Top selling products (last 30 days)',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'limit',
					in: 'query',
					schema: { type: 'integer', default: 5, minimum: 1, maximum: 10 },
					description: 'Number of products to return',
				},
			],
			responses: {
				'200': {
					description: 'Top products list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												name: { type: 'string' },
												quantity: { type: 'integer' },
												revenue: { type: 'number' },
												currency: { type: 'string' },
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/seller/notifications': {
		get: {
			tags: ['Seller'],
			summary: 'List seller notifications',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'Marked as read',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},

	'/api/admin/stats': {
		get: {
			tags: ['Admin'],
			summary: 'Get admin dashboard stats',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			parameters: [
				{
					name: 'days',
					in: 'query',
					schema: { type: 'integer', default: 30 },
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
									signupsByDay: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												date: { type: 'string' },
												count: { type: 'integer' },
											},
										},
									},
									productsByDay: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												date: { type: 'string' },
												count: { type: 'integer' },
											},
										},
									},
									storesByDay: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												date: { type: 'string' },
												count: { type: 'integer' },
											},
										},
									},
									approvalRate: { type: 'number' },
									topStores: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												name: { type: 'string' },
												slug: { type: 'string' },
												created_at: { type: 'string' },
												products: { type: 'integer' },
												followers: { type: 'integer' },
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/users': {
		get: {
			tags: ['Admin'],
			summary: 'List users with search and pagination',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'User list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									users: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												first_name: {
													type: 'string',
													nullable: true,
												},
												last_name: {
													type: 'string',
													nullable: true,
												},
												email: {
													type: 'string',
													nullable: true,
												},
												phone_number: {
													type: 'string',
													nullable: true,
												},
												avatar_url: {
													type: 'string',
													nullable: true,
												},
												status: { type: 'string' },
												created_at: { type: 'string' },
												roles: {
													type: 'array',
													items: { type: 'string' },
												},
												store: {
													type: 'object',
													nullable: true,
													properties: {
														id: { type: 'string' },
														name: {
															type: 'string',
														},
														slug: {
															type: 'string',
														},
														status: {
															type: 'string',
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
				},
				'401': { description: 'Unauthorized' },
			},
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
			responses: {
				'200': {
					description: 'User details',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									user: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											first_name: {
												type: 'string',
												nullable: true,
											},
											last_name: {
												type: 'string',
												nullable: true,
											},
											email: {
												type: 'string',
												nullable: true,
											},
											phone_number: {
												type: 'string',
												nullable: true,
											},
											avatar_url: {
												type: 'string',
												nullable: true,
											},
											status: { type: 'string' },
											created_at: { type: 'string' },
											roles: {
												type: 'array',
												items: { type: 'string' },
											},
										},
									},
									store: {
										type: 'object',
										nullable: true,
										properties: {
											id: { type: 'string' },
											name: { type: 'string' },
											slug: { type: 'string' },
											status: { type: 'string' },
											logo_url: {
												type: 'string',
												nullable: true,
											},
											banner_url: {
												type: 'string',
												nullable: true,
											},
											description: {
												type: 'string',
												nullable: true,
											},
											phone: {
												type: 'string',
												nullable: true,
											},
											whatsapp: {
												type: 'string',
												nullable: true,
											},
											email: {
												type: 'string',
												nullable: true,
											},
											state: { type: 'string' },
											created_at: { type: 'string' },
											verified_at: {
												type: 'string',
												nullable: true,
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'User not found' },
			},
		},
		patch: {
			tags: ['Admin'],
			summary: 'Update user (make admin, change status)',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'User updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		delete: {
			tags: ['Admin'],
			summary: 'Soft-delete a user',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'User deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/stores': {
		get: {
			tags: ['Admin'],
			summary: 'List stores with filters',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
											type: 'object',
											properties: {
												id: { type: 'string' },
												name: { type: 'string' },
												slug: { type: 'string' },
												status: { type: 'string' },
												description: {
													type: 'string',
													nullable: true,
												},
												logo_url: {
													type: 'string',
													nullable: true,
												},
												banner_url: {
													type: 'string',
													nullable: true,
												},
												phone: {
													type: 'string',
													nullable: true,
												},
												whatsapp: {
													type: 'string',
													nullable: true,
												},
												email: {
													type: 'string',
													nullable: true,
												},
												state: { type: 'string' },
												created_at: { type: 'string' },
												provinces: {
													type: 'object',
													properties: {
														name: {
															type: 'string',
														},
													},
												},
												categories: {
													type: 'object',
													properties: {
														id: { type: 'string' },
														name: {
															type: 'string',
														},
													},
												},
												users: {
													type: 'object',
													nullable: true,
													properties: {
														id: { type: 'string' },
														first_name: {
															type: 'string',
															nullable: true,
														},
														last_name: {
															type: 'string',
															nullable: true,
														},
														email: {
															type: 'string',
															nullable: true,
														},
														phone_number: {
															type: 'string',
															nullable: true,
														},
														created_at: {
															type: 'string',
														},
													},
												},
												productCount: {
													type: 'integer',
												},
												followerCount: {
													type: 'integer',
												},
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/stores/{id}': {
		get: {
			tags: ['Admin'],
			summary: 'Get store details with docs and products',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Store with docs and products',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									store: { type: 'object' },
									docs: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: { type: 'string' },
												type: { type: 'string' },
												file_url: { type: 'string' },
												status: { type: 'string' },
												created_at: { type: 'string' },
											},
										},
									},
									products: {
										type: 'array',
										items: { type: 'object' },
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Store not found' },
			},
		},
		patch: {
			tags: ['Admin'],
			summary: 'Approve/reject store, update fields',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
								status: {
									type: 'string',
									enum: [
										'ACTIVE',
										'REJECTED',
										'PENDING',
										'INACTIVE',
										'SUSPENDED',
										'BANNED',
									],
								},
								rejectionReason: { type: 'string' },
								name: { type: 'string' },
								description: { type: 'string' },
								logo_url: { type: 'string' },
								banner_url: { type: 'string' },
								phone: { type: 'string' },
								whatsapp: { type: 'string' },
								email: { type: 'string' },
								state: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Store updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									store: { type: 'object' },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
				'404': { description: 'Store not found' },
			},
		},
		delete: {
			tags: ['Admin'],
			summary: 'Soft-delete a store',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Store deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/products': {
		get: {
			tags: ['Admin'],
			summary: 'List products with filters',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
											type: 'object',
											properties: {
												id: { type: 'string' },
												name: { type: 'string' },
												description: {
													type: 'string',
													nullable: true,
												},
												price: { type: 'integer' },
												discount_price: {
													type: 'integer',
													nullable: true,
												},
												currency: { type: 'string' },
												status: { type: 'string' },
												is_visible: { type: 'boolean' },
												created_at: { type: 'string' },
												store_id: { type: 'string' },
												category_id: {
													type: 'string',
													nullable: true,
												},
												stores: {
													type: 'object',
													nullable: true,
													properties: {
														id: { type: 'string' },
														name: {
															type: 'string',
														},
														slug: {
															type: 'string',
														},
													},
												},
												categories: {
													type: 'object',
													nullable: true,
													properties: {
														id: { type: 'string' },
														name: {
															type: 'string',
														},
													},
												},
												product_images: {
													type: 'array',
													items: {
														type: 'object',
														properties: {
															url: {
																type: 'string',
															},
															is_primary: {
																type: 'boolean',
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
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/products/{id}': {
		patch: {
			tags: ['Admin'],
			summary: 'Update a product',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
								price: { type: 'number' },
								discount_price: { type: 'number' },
								currency: { type: 'string' },
								status: { type: 'string' },
								is_visible: { type: 'boolean' },
								category_id: { type: 'string' },
							},
						},
					},
				},
			},
			responses: {
				'200': {
					description: 'Product updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		delete: {
			tags: ['Admin'],
			summary: 'Soft-delete a product',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
					description: 'Product deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/categories': {
		get: {
			tags: ['Admin'],
			summary: 'List all categories',
			security: [{ CookieAuth: [] }],
			responses: {
				'200': {
					description: 'Category list',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
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
				'401': { description: 'Unauthorized' },
			},
		},
		post: {
			tags: ['Admin'],
			summary: 'Create a category',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'Category created',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									category: {
										$ref: '#/components/schemas/Category',
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
			tags: ['Admin'],
			summary: 'Update a category',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'Category updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		delete: {
			tags: ['Admin'],
			summary: 'Hard-delete a category',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'Category deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
	},
	'/api/admin/notifications': {
		get: {
			tags: ['Admin'],
			summary: 'List sent notifications',
			security: [{ CookieAuth: [] }],
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
											type: 'object',
											properties: {
												id: { type: 'string' },
												title: { type: 'string' },
												body: { type: 'string' },
												type: { type: 'string' },
												created_at: { type: 'string' },
												recipientCount: {
													type: 'integer',
												},
												readCount: { type: 'integer' },
											},
										},
									},
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
		},
		post: {
			tags: ['Admin'],
			summary: 'Send notification to users',
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
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
			responses: {
				'200': {
					description: 'Notification sent',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', enum: [true] },
									notification: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											target: { type: 'string' },
											title: { type: 'string' },
											body: { type: 'string' },
											sentAt: { type: 'string' },
											sentBy: { type: 'string' },
										},
									},
									recipientCount: { type: 'integer' },
								},
							},
						},
					},
				},
				'401': { description: 'Unauthorized' },
			},
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
							'Session cookie set via POST /api/auth/session (web)',
					},
					BearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
						description:
							'Firebase ID token from user.getIdToken() (mobile)',
					},
				},
				schemas,
			},
			security: [{ CookieAuth: [] }, { BearerAuth: [] }],
			paths,
		},
	})
	return spec
}
