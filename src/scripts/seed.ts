import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
	categories,
	conversationParticipants,
	conversations,
	messageProducts,
	messages,
	onboardingSteps,
	permissions,
	productImages,
	productStock,
	products,
	productVariants,
	provinces,
	rolePermissions,
	roles,
	sellerOnboardings,
	sellerProfiles,
	storeFollowers,
	stores,
	userRoles,
	users,
	verificationDocuments,
} from '../db/schema'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL must be configured.')
}

const db = drizzle(process.env.DATABASE_URL)

async function seed() {
	try {
		console.log('🌱 Starting seed...')

		await db.transaction(async (tx) => {
			// =========================
			// ROLES + PERMISSIONS
			// =========================
			const insertedRoles = await tx.select().from(roles)
			const insertedPermissions = await tx.select().from(permissions)

			// =========================
			// USERS
			// =========================
			console.log('👥 Seeding users...')

			await tx.delete(users)

			const insertedUsers = await tx
				.insert(users)
				.values([
					{
						firebaseUid: 'firebase_admin_001',
						email: 'admin@zuka.com',
						firstName: 'Admin',
						lastName: 'User',
						phoneNumber: '+258-84-123-4567',
						emailVerified: true,
						phoneVerified: true,
						status: 'ACTIVE',
					},
					{
						firebaseUid: 'firebase_seller_001',
						email: 'seller1@example.com',
						firstName: 'João',
						lastName: 'Silva',
						phoneNumber: '+258-82-345-6789',
						emailVerified: true,
						phoneVerified: true,
						status: 'ACTIVE',
					},
					{
						firebaseUid: 'firebase_seller_002',
						email: 'seller2@example.com',
						firstName: 'Maria',
						lastName: 'Santos',
						phoneNumber: '+258-84-567-8901',
						emailVerified: true,
						phoneVerified: false,
						status: 'ACTIVE',
					},
					{
						firebaseUid: 'firebase_buyer_001',
						email: 'buyer1@example.com',
						firstName: 'Pedro',
						lastName: 'Nunes',
						phoneNumber: '+258-87-123-4567',
						emailVerified: true,
						phoneVerified: true,
						status: 'ACTIVE',
					},
					{
						firebaseUid: 'firebase_buyer_002',
						email: 'buyer2@example.com',
						firstName: 'Ana',
						lastName: 'Costa',
						phoneNumber: '+258-82-987-6543',
						emailVerified: false,
						phoneVerified: false,
						status: 'ACTIVE',
					},
					{
						firebaseUid: 'firebase_moderator_001',
						email: 'moderator@zuka.com',
						firstName: 'Carlos',
						lastName: 'Ferreira',
						phoneNumber: '+258-84-246-8101',
						emailVerified: true,
						phoneVerified: true,
						status: 'ACTIVE',
					},
				])
				.returning()

			// =========================
			// USER ROLES
			// =========================
			console.log('🔗 Seeding user roles...')

			const adminRole = insertedRoles.find((r) => r.name === 'admin')!
			const sellerRole = insertedRoles.find((r) => r.name === 'seller')!
			const buyerRole = insertedRoles.find((r) => r.name === 'buyer')!
			const supportRole = insertedRoles.find((r) => r.name === 'support')!

			await tx.delete(userRoles)

			await tx.insert(userRoles).values([
				{ userId: insertedUsers[0].id, roleId: adminRole.id },
				{ userId: insertedUsers[1].id, roleId: sellerRole.id },
				{ userId: insertedUsers[2].id, roleId: sellerRole.id },
				{ userId: insertedUsers[3].id, roleId: buyerRole.id },
				{ userId: insertedUsers[4].id, roleId: buyerRole.id },
				{ userId: insertedUsers[5].id, roleId: supportRole.id },
			])

			// =========================
			// ROLE PERMISSIONS
			// =========================
			console.log('🔐 Seeding role permissions...')

			const getP = (key: string) =>
				insertedPermissions.find((p) => p.key === key)!

			await tx.delete(rolePermissions)

			await tx.insert(rolePermissions).values([
				// admin
				{
					roleId: adminRole.id,
					permissionId: getP('product.create').id,
				},
				{
					roleId: adminRole.id,
					permissionId: getP('product.update').id,
				},
				{
					roleId: adminRole.id,
					permissionId: getP('product.delete').id,
				},
				{ roleId: adminRole.id, permissionId: getP('product.read').id },
				{ roleId: adminRole.id, permissionId: getP('order.create').id },
				{ roleId: adminRole.id, permissionId: getP('order.read').id },
				{ roleId: adminRole.id, permissionId: getP('order.update').id },
				{ roleId: adminRole.id, permissionId: getP('user.read').id },
				{ roleId: adminRole.id, permissionId: getP('user.ban').id },
				{
					roleId: adminRole.id,
					permissionId: getP('dispute.manage').id,
				},

				// seller
				{
					roleId: sellerRole.id,
					permissionId: getP('product.create').id,
				},
				{
					roleId: sellerRole.id,
					permissionId: getP('product.update').id,
				},
				{
					roleId: sellerRole.id,
					permissionId: getP('product.delete').id,
				},
				{
					roleId: sellerRole.id,
					permissionId: getP('product.read').id,
				},
				{ roleId: sellerRole.id, permissionId: getP('order.read').id },

				// buyer
				{ roleId: buyerRole.id, permissionId: getP('product.read').id },
				{ roleId: buyerRole.id, permissionId: getP('order.create').id },
				{ roleId: buyerRole.id, permissionId: getP('order.read').id },

				// support
				{ roleId: supportRole.id, permissionId: getP('user.read').id },
				{ roleId: supportRole.id, permissionId: getP('user.ban').id },
				{
					roleId: supportRole.id,
					permissionId: getP('dispute.manage').id,
				},
			])

			// =========================
			// CATEGORIES
			// =========================
			console.log('📦 Seeding categories...')

			await tx.delete(categories)

			const insertedCategories = await tx
				.insert(categories)
				.values([
					{ name: 'Eletrônicos', slug: 'eletronicos' },
					{ name: 'Moda e Vestuário', slug: 'moda-e-vestuario' },
					{ name: 'Casa e Decoração', slug: 'casa-e-decoracao' },
					{
						name: 'Beleza e Cuidados Pessoais',
						slug: 'beleza-cuidados-pessoais',
					},
					{ name: 'Esportes e Lazer', slug: 'esportes-lazer' },
					{
						name: 'Alimentos e Bebidas',
						slug: 'alimentos-e-bebidas',
					},
					{ name: 'Livros e Educação', slug: 'livros-educacao' },
					{ name: 'Automóveis e Motos', slug: 'automoveis-motos' },
					{ name: 'Saúde e Bem-estar', slug: 'saude-bem-estar' },
					{
						name: 'Tecnologia e Acessórios',
						slug: 'tecnologia-acessorios',
					},
					{ name: 'Moda', slug: 'moda' },
				])
				.returning()

			// =========================
			// PROVINCES
			// =========================
			console.log('🌍 Seeding provinces...')

			await tx.delete(provinces)

			const insertedProvinces = await tx
				.insert(provinces)
				.values([
					{ name: 'Maputo Cidade', slug: 'maputo-cidade' },
					{ name: 'Maputo Província', slug: 'maputo-provincia' },
					{ name: 'Gaza', slug: 'gaza' },
					{ name: 'Inhambane', slug: 'inhambane' },
					{ name: 'Sofala', slug: 'sofala' },
					{ name: 'Manica', slug: 'manica' },
					{ name: 'Tete', slug: 'tete' },
					{ name: 'Zambézia', slug: 'zambezia' },
					{ name: 'Nampula', slug: 'nampula' },
					{ name: 'Cabo Delgado', slug: 'cabo-delgado' },
					{ name: 'Niassa', slug: 'niassa' },
				])
				.returning()

			// =========================
			// SELLER PROFILES
			// =========================
			console.log('💼 Seeding seller profiles...')

			await tx.delete(sellerProfiles)

			const insertedSellerProfiles = await tx
				.insert(sellerProfiles)
				.values([
					{
						userId: insertedUsers[1].id,
						status: 'VERIFIED',
						verifiedAt: new Date(),
						onboardedAt: new Date(),
					},
					{
						userId: insertedUsers[2].id,
						status: 'PENDING',
						verifiedAt: null,
						onboardedAt: null,
					},
				])
				.returning()

			// =========================
			// STORES
			// =========================
			console.log('🏪 Seeding stores...')

			await tx.delete(stores)

			const maputo = insertedProvinces.find(
				(p) => p.slug === 'maputo-cidade'
			)!
			const gaza = insertedProvinces.find((p) => p.slug === 'gaza')!
			const electronics = insertedCategories.find(
				(c) => c.slug === 'eletronicos'
			)!
			const fashion = insertedCategories.find(
				(c) => c.slug === 'moda-e-vestuario'
			)!

			const insertedStores = await tx
				.insert(stores)
				.values([
					{
						ownerId: insertedUsers[1].id,
						sellerProfileId: insertedSellerProfiles[0].id,
						name: 'Tech Store Maputo',
						email: 'tech@store.mz',
						state: 'Maputo',
						mainStoreCategoryId: electronics.id,
						provinceId: maputo.id,
						slug: 'tech-store-maputo',
						description: 'Loja de eletrônicos e tecnologia',
						logoUrl: 'https://via.placeholder.com/200',
						bannerUrl: 'https://via.placeholder.com/1200x300',
						verifiedAt: new Date(),
						status: 'ACTIVE',
					},
					{
						ownerId: insertedUsers[1].id,
						sellerProfileId: insertedSellerProfiles[0].id,
						name: 'Fashion Hub',
						email: 'fashion@store.mz',
						state: 'Maputo',
						mainStoreCategoryId: fashion.id,
						provinceId: maputo.id,
						slug: 'fashion-hub',
						description: 'Moda e vestuário premium',
						logoUrl: 'https://via.placeholder.com/200',
						bannerUrl: 'https://via.placeholder.com/1200x300',
						verifiedAt: new Date(),
						status: 'ACTIVE',
					},
					{
						ownerId: insertedUsers[2].id,
						sellerProfileId: insertedSellerProfiles[1].id,
						name: 'Gourmet Foods Gaza',
						email: 'gourmet@store.mz',
						state: 'Gaza',
						mainStoreCategoryId: insertedCategories.find(
							(c) => c.slug === 'alimentos-e-bebidas'
						)!.id,
						provinceId: gaza.id,
						slug: 'gourmet-foods-gaza',
						description: 'Alimentos gourmet importados',
						logoUrl: 'https://via.placeholder.com/200',
						bannerUrl: 'https://via.placeholder.com/1200x300',
						verifiedAt: null,
						status: 'PENDING',
					},
				])
				.returning()

			// =========================
			// PRODUCTS
			// =========================
			console.log('📱 Seeding products...')

			await tx.delete(products)

			const insertedProducts = await tx
				.insert(products)
				.values([
					{
						storeId: insertedStores[0].id,
						categoryId: electronics.id,
						name: 'Samsung Galaxy S24',
						slug: 'samsung-galaxy-s24',
						isVisible: true,
						description: 'Smartphone topo de linha',
						status: 'ACTIVE',
						price: 1200000,
						discountPrice: 999900,
						currency: 'MZN',
					},
					{
						storeId: insertedStores[0].id,
						categoryId: electronics.id,
						name: 'iPhone 15 Pro',
						slug: 'iphone-15-pro',
						isVisible: true,
						description: 'Apple flagship',
						status: 'ACTIVE',
						price: 1400000,
						discountPrice: null,
						currency: 'MZN',
					},
					{
						storeId: insertedStores[0].id,
						categoryId: electronics.id,
						name: 'MacBook Pro 14',
						slug: 'macbook-pro-14',
						isVisible: true,
						description: 'Laptop profissional',
						status: 'ACTIVE',
						price: 5500000,
						discountPrice: 5200000,
						currency: 'MZN',
					},
					{
						storeId: insertedStores[1].id,
						categoryId: fashion.id,
						name: 'Jeans Premium',
						slug: 'jeans-premium',
						isVisible: true,
						description: 'Calça jeans premium',
						status: 'ACTIVE',
						price: 150000,
						discountPrice: 120000,
						currency: 'MZN',
					},
					{
						storeId: insertedStores[1].id,
						categoryId: fashion.id,
						name: 'Camiseta Básica',
						slug: 'camiseta-basica',
						isVisible: true,
						description: 'Algodão 100%',
						status: 'ACTIVE',
						price: 35000,
						discountPrice: 25000,
						currency: 'MZN',
					},
				])
				.returning()

			// =========================
			// STOCK
			// =========================
			await tx.delete(productStock)

			await tx.insert(productStock).values(
				insertedProducts.map((p, i) => ({
					productId: p.id,
					quantity: [50, 30, 15, 100, 200][i],
					reserved: [5, 0, 2, 10, 20][i],
				}))
			)

			// =========================
			// VARIANTS
			// =========================
			await tx.delete(productVariants)

			await tx.insert(productVariants).values([
				{
					storeId: insertedStores[0].id,
					productId: insertedProducts[0].id,
					sku: 'SGS24-BLK',
					price: '1200000',
					stock: 20,
					attributes: { color: 'Black', storage: '256GB' },
				},
			])

			// =========================
			// IMAGES
			// =========================
			await tx.delete(productImages)

			await tx.insert(productImages).values([
				{
					productId: insertedProducts[0].id,
					url: 'https://via.placeholder.com/500',
					position: 0,
					isPrimary: true,
					alt: 'Galaxy S24',
				},
			])

			// =========================
			// CHAT (conversations/messages)
			// =========================
			await tx.delete(conversations)

			const insertedConversations = await tx
				.insert(conversations)
				.values([{}, {}])
				.returning()

			await tx.delete(conversationParticipants)

			await tx.insert(conversationParticipants).values([
				{
					conversationId: insertedConversations[0].id,
					userId: insertedUsers[1].id,
				},
				{
					conversationId: insertedConversations[0].id,
					userId: insertedUsers[3].id,
				},
			])

			await tx.delete(messages)

			const insertedMessages = await tx
				.insert(messages)
				.values([
					{
						conversationId: insertedConversations[0].id,
						senderId: insertedUsers[1].id,
						content: 'Olá, ainda tens stock?',
					},
				])
				.returning()

			await tx.delete(messageProducts)

			await tx.insert(messageProducts).values([
				{
					messageId: insertedMessages[0].id,
					productId: insertedProducts[0].id,
				},
			])

			// =========================
			// FOLLOWERS
			// =========================
			await tx.delete(storeFollowers)

			await tx.insert(storeFollowers).values([
				{
					userId: insertedUsers[3].id,
					storeId: insertedStores[0].id,
					followedAt: new Date(),
				},
			])

			// =========================
			// SELLER ONBOARDING
			// =========================
			await tx.delete(sellerOnboardings)

			const insertedOnboardings = await tx
				.insert(sellerOnboardings)
				.values([
					{
						sellerProfileId: insertedSellerProfiles[0].id,
						status: 'APPROVED',
						currentStep: 'PAYMENT_VERIFICATION',
						submittedAt: new Date(),
						approvedAt: new Date(),
					},
				])
				.returning()

			// =========================
			// ONBOARDING STEPS
			// =========================
			await tx.delete(onboardingSteps)

			await tx.insert(onboardingSteps).values([
				{
					onboardingId: insertedOnboardings[0].id,
					step: 'PERSONAL_INFO',
					data: { ok: true },
					completed: true,
				},
			])

			// =========================
			// VERIFICATION DOCUMENTS
			// =========================
			await tx.delete(verificationDocuments)

			await tx.insert(verificationDocuments).values([
				{
					ownerId: insertedUsers[1].id,
					storeId: insertedStores[0].id,
					type: 'ID_CARD',
					status: 'APPROVED',
					fileUrl: 'https://via.placeholder.com/800',
					backFileUrl: null,
					metadata: JSON.stringify({ number: '123' }),
					rejectionReason: null,
					reviewedAt: new Date(),
				},
			])

			console.log('✨ Seed completed successfully!')
		})

		process.exit(0)
	} catch (error) {
		console.error('❌ Seed failed:', error)
		process.exit(1)
	}
}

seed()
