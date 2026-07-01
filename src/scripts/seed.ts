import './load-env'
import { uuidv7 } from 'uuidv7'
import { createSupabaseAdmin } from '../lib/supabase/admin'
import type { Database } from '../lib/supabase/types'

const supabase = createSupabaseAdmin()

async function clearTable(table: string) {
	const { error } = await supabase
		.from(table as never)
		.delete()
		.neq('id' as never, '00000000-0000-0000-0000-000000000000')

	if (!error) return
	if (error.message.includes('Could not find')) return

	const compositeKeyColumn: Record<string, string> = {
		conversation_participants: 'conversation_id',
		role_permissions: 'role_id',
		user_roles: 'user_id',
	}

	const column = compositeKeyColumn[table]
	if (column) {
		const { error: compositeError } = await supabase
			.from(table as never)
			.delete()
			.gte(column as never, '00000000-0000-0000-0000-000000000000')

		if (compositeError) {
			console.warn(`Could not clear ${table}:`, compositeError.message)
		}
		return
	}

	console.warn(`Could not clear ${table}:`, error.message)
}

async function seed() {
	try {
		console.log('🌱 Starting Supabase seed...')

		// Clear in dependency order
		for (const table of [
			'order_items',
			'orders',
			'message_products',
			'messages',
			'conversation_participants',
			'conversations',
			'store_followers',
			'verification_documents',
			'seller_onboarding_steps',
			'seller_onboarding',
			'product_images',
			'product_stock',
			'product_variants',
			'products',
			'stores',
			'seller_profiles',
			'user_roles',
			'role_permissions',
			'users',
			'categories',
			'provinces',
			'permissions',
			'roles',
		]) {
			await clearTable(table)
		}

		const roles = [
			{ id: uuidv7(), name: 'admin', description: 'Gerencia o marketplace' },
			{ id: uuidv7(), name: 'super_admin', description: 'Acesso total ao sistema' },
			{ id: uuidv7(), name: 'seller', description: 'Gerencia produtos e vendas' },
			{ id: uuidv7(), name: 'buyer', description: 'Compra produtos' },
			{ id: uuidv7(), name: 'support', description: 'Atendimento ao cliente' },
		]

		const permissions = [
			{ id: uuidv7(), key: 'product.create', description: 'Criar produtos' },
			{ id: uuidv7(), key: 'product.update', description: 'Atualizar produtos' },
			{ id: uuidv7(), key: 'product.delete', description: 'Excluir produtos' },
			{ id: uuidv7(), key: 'product.read', description: 'Visualizar produtos' },
			{ id: uuidv7(), key: 'order.create', description: 'Criar pedidos' },
			{ id: uuidv7(), key: 'order.read', description: 'Visualizar pedidos' },
			{ id: uuidv7(), key: 'order.update', description: 'Atualizar pedidos' },
			{ id: uuidv7(), key: 'user.read', description: 'Visualizar usuários' },
			{ id: uuidv7(), key: 'user.ban', description: 'Banir usuários' },
			{ id: uuidv7(), key: 'dispute.manage', description: 'Gerenciar disputas' },
		]

		await supabase.from('roles').insert(roles)
		await supabase.from('permissions').insert(permissions)

		const perm = Object.fromEntries(permissions.map((p) => [p.key, p.id]))
		const role = Object.fromEntries(roles.map((r) => [r.name, r.id]))

		await supabase.from('role_permissions').insert([
			...permissions.map((p) => ({ role_id: role.admin, permission_id: p.id })),
			...permissions.map((p) => ({ role_id: role.super_admin, permission_id: p.id })),
			{ role_id: role.seller, permission_id: perm['product.create'] },
			{ role_id: role.seller, permission_id: perm['product.update'] },
			{ role_id: role.seller, permission_id: perm['product.delete'] },
			{ role_id: role.seller, permission_id: perm['product.read'] },
			{ role_id: role.seller, permission_id: perm['order.read'] },
			{ role_id: role.buyer, permission_id: perm['order.create'] },
			{ role_id: role.buyer, permission_id: perm['order.read'] },
			{ role_id: role.buyer, permission_id: perm['product.read'] },
			{ role_id: role.support, permission_id: perm['order.read'] },
			{ role_id: role.support, permission_id: perm['user.read'] },
			{ role_id: role.support, permission_id: perm['dispute.manage'] },
		])

		const users = [
			{ id: uuidv7(), firebase_uid: 'firebase_admin_001', email: 'admin@zuka.com', first_name: 'Admin', last_name: 'User', phone_number: '+258-84-123-4567', email_verified: true, phone_verified: true, status: 'ACTIVE' },
			{ id: uuidv7(), firebase_uid: 'firebase_seller_001', email: 'seller1@example.com', first_name: 'João', last_name: 'Silva', phone_number: '+258-82-345-6789', email_verified: true, phone_verified: true, status: 'ACTIVE' },
			{ id: uuidv7(), firebase_uid: 'firebase_seller_002', email: 'seller2@example.com', first_name: 'Maria', last_name: 'Santos', phone_number: '+258-84-567-8901', email_verified: true, phone_verified: false, status: 'ACTIVE' },
			{ id: uuidv7(), firebase_uid: 'firebase_buyer_001', email: 'buyer1@example.com', first_name: 'Pedro', last_name: 'Nunes', phone_number: '+258-87-123-4567', email_verified: true, phone_verified: true, status: 'ACTIVE' },
			{ id: uuidv7(), firebase_uid: 'firebase_buyer_002', email: 'buyer2@example.com', first_name: 'Ana', last_name: 'Costa', phone_number: '+258-82-987-6543', email_verified: false, phone_verified: false, status: 'ACTIVE' },
			{ id: uuidv7(), firebase_uid: 'firebase_moderator_001', email: 'moderator@zuka.com', first_name: 'Carlos', last_name: 'Ferreira', phone_number: '+258-84-246-8101', email_verified: true, phone_verified: true, status: 'ACTIVE' },
		]

		await supabase.from('users').insert(users)

		await supabase.from('user_roles').insert([
			{ user_id: users[0].id, role_id: role.admin },
			{ user_id: users[1].id, role_id: role.seller },
			{ user_id: users[2].id, role_id: role.seller },
			{ user_id: users[3].id, role_id: role.buyer },
			{ user_id: users[4].id, role_id: role.buyer },
			{ user_id: users[5].id, role_id: role.support },
		])

		const categories = [
			{ id: uuidv7(), name: 'Eletrônicos', slug: 'eletronicos' },
			{ id: uuidv7(), name: 'Moda e Vestuário', slug: 'moda-e-vestuario' },
			{ id: uuidv7(), name: 'Casa e Decoração', slug: 'casa-e-decoracao' },
			{ id: uuidv7(), name: 'Beleza e Cuidados Pessoais', slug: 'beleza-cuidados-pessoais' },
			{ id: uuidv7(), name: 'Esportes e Lazer', slug: 'esportes-lazer' },
			{ id: uuidv7(), name: 'Alimentos e Bebidas', slug: 'alimentos-e-bebidas' },
			{ id: uuidv7(), name: 'Livros e Educação', slug: 'livros-educacao' },
			{ id: uuidv7(), name: 'Automóveis e Motos', slug: 'automoveis-motos' },
			{ id: uuidv7(), name: 'Saúde e Bem-estar', slug: 'saude-bem-estar' },
			{ id: uuidv7(), name: 'Tecnologia e Acessórios', slug: 'tecnologia-acessorios' },
		]

		await supabase.from('categories').insert(categories)

		const provinces = [
			{ id: uuidv7(), name: 'Maputo Cidade', slug: 'maputo-cidade' },
			{ id: uuidv7(), name: 'Maputo Província', slug: 'maputo-provincia' },
			{ id: uuidv7(), name: 'Gaza', slug: 'gaza' },
			{ id: uuidv7(), name: 'Inhambane', slug: 'inhambane' },
			{ id: uuidv7(), name: 'Sofala', slug: 'sofala' },
			{ id: uuidv7(), name: 'Manica', slug: 'manica' },
			{ id: uuidv7(), name: 'Tete', slug: 'tete' },
			{ id: uuidv7(), name: 'Zambézia', slug: 'zambezia' },
			{ id: uuidv7(), name: 'Nampula', slug: 'nampula' },
			{ id: uuidv7(), name: 'Cabo Delgado', slug: 'cabo-delgado' },
			{ id: uuidv7(), name: 'Niassa', slug: 'niassa' },
		]

		await supabase.from('provinces').insert(provinces)

		const sellerProfiles = [
			{ id: uuidv7(), user_id: users[1].id, status: 'VERIFIED' as const, verified_at: new Date().toISOString(), onboarded_at: new Date().toISOString() },
			{ id: uuidv7(), user_id: users[2].id, status: 'PENDING' as const },
		]

		await supabase.from('seller_profiles').insert(sellerProfiles)

		const maputo = provinces[0]
		const gaza = provinces[2]
		const electronics = categories[0]
		const fashion = categories[1]
		const food = categories[5]

		const stores = [
			{ id: uuidv7(), owner_id: users[1].id, seller_profile_id: sellerProfiles[0].id, name: 'Tech Store Maputo', email: 'tech@store.mz', state: 'Maputo', main_store_category_id: electronics.id, province_id: maputo.id, slug: 'tech-store-maputo', description: 'Loja de eletrônicos e tecnologia', logo_url: 'https://via.placeholder.com/200', banner_url: 'https://via.placeholder.com/1200x300', verified_at: new Date().toISOString(), status: 'ACTIVE' as const },
			{ id: uuidv7(), owner_id: users[1].id, seller_profile_id: sellerProfiles[0].id, name: 'Fashion Hub', email: 'fashion@store.mz', state: 'Maputo', main_store_category_id: fashion.id, province_id: maputo.id, slug: 'fashion-hub', description: 'Moda e vestuário premium', logo_url: 'https://via.placeholder.com/200', banner_url: 'https://via.placeholder.com/1200x300', verified_at: new Date().toISOString(), status: 'ACTIVE' as const },
			{ id: uuidv7(), owner_id: users[2].id, seller_profile_id: sellerProfiles[1].id, name: 'Gourmet Foods Gaza', email: 'gourmet@store.mz', state: 'Gaza', main_store_category_id: food.id, province_id: gaza.id, slug: 'gourmet-foods-gaza', description: 'Alimentos gourmet importados', logo_url: 'https://via.placeholder.com/200', banner_url: 'https://via.placeholder.com/1200x300', status: 'PENDING' as const },
		]

		await supabase.from('stores').insert(stores)

		const products = [
			{ id: uuidv7(), store_id: stores[0].id, category_id: electronics.id, name: 'Samsung Galaxy S24', slug: 'samsung-galaxy-s24', is_visible: true, description: 'Smartphone topo de linha', status: 'ACTIVE' as const, price: 1200000, discount_price: 999900, currency: 'MZN' },
			{ id: uuidv7(), store_id: stores[0].id, category_id: electronics.id, name: 'iPhone 15 Pro', slug: 'iphone-15-pro', is_visible: true, description: 'Apple flagship', status: 'ACTIVE' as const, price: 1400000, currency: 'MZN' },
			{ id: uuidv7(), store_id: stores[0].id, category_id: electronics.id, name: 'MacBook Pro 14', slug: 'macbook-pro-14', is_visible: true, description: 'Laptop profissional', status: 'ACTIVE' as const, price: 5500000, discount_price: 5200000, currency: 'MZN' },
			{ id: uuidv7(), store_id: stores[1].id, category_id: fashion.id, name: 'Jeans Premium', slug: 'jeans-premium', is_visible: true, description: 'Calça jeans premium', status: 'ACTIVE' as const, price: 150000, discount_price: 120000, currency: 'MZN' },
			{ id: uuidv7(), store_id: stores[1].id, category_id: fashion.id, name: 'Camiseta Básica', slug: 'camiseta-basica', is_visible: true, description: 'Algodão 100%', status: 'ACTIVE' as const, price: 35000, discount_price: 25000, currency: 'MZN' },
		]

		await supabase.from('products').insert(products)

		await supabase.from('product_stock').insert(
			products.map((p, i) => ({
				id: uuidv7(),
				product_id: p.id,
				quantity: [50, 30, 15, 100, 200][i],
				reserved: [5, 0, 2, 10, 20][i],
			}))
		)

		await supabase.from('product_variants').insert([
			{ id: uuidv7(), store_id: stores[0].id, product_id: products[0].id, sku: 'SGS24-BLK', price: 1200000, stock: 20, attributes: { color: 'Black', storage: '256GB' } },
		])

		await supabase.from('product_images').insert([
			{ id: uuidv7(), product_id: products[0].id, url: 'https://via.placeholder.com/500', position: 0, is_primary: true, alt: 'Galaxy S24' },
		])

		const conversationId = uuidv7()
		await supabase.from('conversations').insert({ id: conversationId })
		await supabase.from('conversation_participants').insert([
			{ conversation_id: conversationId, user_id: users[1].id },
			{ conversation_id: conversationId, user_id: users[3].id },
		])

		const messageId = uuidv7()
		await supabase.from('messages').insert({
			id: messageId,
			conversation_id: conversationId,
			sender_id: users[1].id,
			content: 'Olá, ainda tens stock?',
		})

		await supabase.from('message_products').insert({
			id: uuidv7(),
			message_id: messageId,
			product_id: products[0].id,
		})

		await supabase.from('store_followers').insert({
			id: uuidv7(),
			user_id: users[3].id,
			store_id: stores[0].id,
		})

		const onboardingId = uuidv7()
		await supabase.from('seller_onboarding').insert({
			id: onboardingId,
			seller_profile_id: sellerProfiles[0].id,
			status: 'APPROVED' as const,
			current_step: 'PAYMENT_VERIFICATION',
			submitted_at: new Date().toISOString(),
			approved_at: new Date().toISOString(),
		})

		await supabase.from('seller_onboarding_steps').insert({
			id: uuidv7(),
			onboarding_id: onboardingId,
			step: 'PERSONAL_INFO',
			data: { ok: true },
			completed: true,
		})

		await supabase.from('verification_documents').insert({
			id: uuidv7(),
			owner_id: users[1].id,
			store_id: stores[0].id,
			type: 'ID_CARD',
			status: 'APPROVED' as const,
			file_url: 'https://via.placeholder.com/800',
			metadata: JSON.stringify({ number: '123' }),
			reviewed_at: new Date().toISOString(),
		})

		const orders = [
			{
				id: uuidv7(),
				buyer_id: users[3].id,
				store_id: stores[0].id,
				status: 'SHIPPING' as const,
				total: 999900,
				currency: 'MZN',
				item_count: 1,
			},
			{
				id: uuidv7(),
				buyer_id: users[3].id,
				store_id: stores[1].id,
				status: 'COMPLETED' as const,
				total: 120000,
				currency: 'MZN',
				item_count: 1,
			},
			{
				id: uuidv7(),
				buyer_id: users[4].id,
				store_id: stores[0].id,
				status: 'PENDING' as const,
				total: 1400000,
				currency: 'MZN',
				item_count: 1,
			},
		]

		await supabase.from('orders').insert(orders)

		await supabase.from('order_items').insert([
			{
				id: uuidv7(),
				order_id: orders[0].id,
				product_id: products[0].id,
				quantity: 1,
				unit_price: 999900,
				currency: 'MZN',
			},
			{
				id: uuidv7(),
				order_id: orders[1].id,
				product_id: products[3].id,
				quantity: 1,
				unit_price: 120000,
				currency: 'MZN',
			},
			{
				id: uuidv7(),
				order_id: orders[2].id,
				product_id: products[1].id,
				quantity: 1,
				unit_price: 1400000,
				currency: 'MZN',
			},
		])

		console.log('✨ Supabase seed completed successfully!')
		process.exit(0)
	} catch (error) {
		console.error('❌ Seed failed:', error)
		process.exit(1)
	}
}

seed()
