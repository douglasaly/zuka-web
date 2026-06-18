import { db } from '@/db'
import { permissions } from '@/db/schema/permissions'
import { rolePermissions } from '@/db/schema/role-permissions'
import { roles } from '@/db/schema/roles'

async function seed() {
	console.log('🌱 Iniciando seed de RBAC...')

	//? ROLES
	const [admin, superAdmin, seller, buyer, support] = await db
		.insert(roles)
		.values([
			{
				name: 'admin',
				description:
					'Gerencia o marketplace com acesso total às funcionalidades administrativas',
			},
			{
				name: 'super_admin',
				description:
					'Acesso total ao sistema, incluindo override de todas as regras e permissões',
			},
			{
				name: 'seller',
				description:
					'Pode gerenciar produtos e pedidos relacionados às suas vendas',
			},
			{
				name: 'buyer',
				description:
					'Pode comprar produtos e gerenciar seus próprios pedidos',
			},
			{
				name: 'support',
				description:
					'Responsável pelo atendimento ao cliente e resolução de disputas',
			},
		])
		.returning()

	//? PERMISSÕES
	const perms = await db
		.insert(permissions)
		.values([
			{ key: 'product.create', description: 'Criar produtos' },
			{ key: 'product.update', description: 'Atualizar produtos' },
			{ key: 'product.delete', description: 'Excluir produtos' },
			{ key: 'product.read', description: 'Visualizar produtos' },

			{ key: 'order.create', description: 'Criar pedidos' },
			{ key: 'order.read', description: 'Visualizar pedidos' },
			{ key: 'order.update', description: 'Atualizar pedidos' },

			{ key: 'user.read', description: 'Visualizar usuários' },
			{ key: 'user.ban', description: 'Banir usuários do sistema' },

			{
				key: 'dispute.manage',
				description: 'Gerenciar disputas e conflitos',
			},
		])
		.returning()

	const permMap = Object.fromEntries(perms.map((p) => [p.key, p.id]))

	//? ROLE-PERMISSIONS
	await db.insert(rolePermissions).values([
		// ADMIN (controle total do marketplace)
		...perms.map((p) => ({
			roleId: admin.id,
			permissionId: p.id,
		})),

		// SUPER ADMIN (controle total do sistema)
		...perms.map((p) => ({
			roleId: superAdmin.id,
			permissionId: p.id,
		})),

		// SELLER (vendedor)
		{ roleId: seller.id, permissionId: permMap['product.create'] },
		{ roleId: seller.id, permissionId: permMap['product.update'] },
		{ roleId: seller.id, permissionId: permMap['product.delete'] },
		{ roleId: seller.id, permissionId: permMap['product.read'] },
		{ roleId: seller.id, permissionId: permMap['order.read'] },

		// BUYER (cliente)
		{ roleId: buyer.id, permissionId: permMap['order.create'] },
		{ roleId: buyer.id, permissionId: permMap['order.read'] },
		{ roleId: buyer.id, permissionId: permMap['product.read'] },

		// SUPPORT (suporte)
		{ roleId: support.id, permissionId: permMap['order.read'] },
		{ roleId: support.id, permissionId: permMap['user.read'] },
		{ roleId: support.id, permissionId: permMap['dispute.manage'] },
	])

	console.log('✅ Seed de RBAC concluído com sucesso!')
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('❌ Erro no seed:', err)
		process.exit(1)
	})
