import './load-env'
import { uuidv7 } from 'uuidv7'
import {
	STORE_OWNER_PERMISSIONS,
	STORE_PERMISSIONS,
	STORE_ROLE_UI,
} from '../lib/auth/store-permissions'
import { createSupabaseAdmin } from '../lib/supabase/admin'

const supabase = createSupabaseAdmin()

async function seed() {
	console.log('🌱 Iniciando seed de RBAC...')

	const roles = [
		{
			id: uuidv7(),
			name: 'admin',
			description:
				'Gerencia o marketplace com acesso total às funcionalidades administrativas',
		},
		{
			id: uuidv7(),
			name: 'super_admin',
			description:
				'Acesso total ao sistema, incluindo override de todas as regras e permissões',
		},
		{
			id: uuidv7(),
			name: 'seller',
			description:
				'Pode gerenciar produtos e pedidos relacionados às suas vendas',
		},
		{
			id: uuidv7(),
			name: 'buyer',
			description:
				'Pode comprar produtos e gerenciar seus próprios pedidos',
		},
		{
			id: uuidv7(),
			name: 'support',
			description:
				'Responsável pelo atendimento ao cliente e resolução de disputas',
		},
		{
			id: uuidv7(),
			name: 'store_owner',
			description:
				'Dono da loja. Com acesso total à loja e gestão da Equipe',
		},
		{
			id: uuidv7(),
			name: 'store_manager',
			description:
				'Gestor da loja. Pode realizar todas as operações e convidar novos membros',
		},
		{
			id: uuidv7(),
			name: 'store_staff',
			description:
				'Colaborador. Pode gerenciar produtos, pedidos, mensagens e respostas a avaliações',
		},
		{
			id: uuidv7(),
			name: 'store_viewer',
			description: 'Visualizador. Pode consultar apenas os dados da loja e os produtos',
		},
	]

	const permissionDefs: Array<{ key: string; description: string }> = [
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
		{ key: 'store.read', description: 'Ver perfil e dados da loja' },
		{ key: 'store.update', description: 'Editar perfil da loja' },
		{ key: 'member.read', description: 'Ver membros da loja' },
		{
			key: 'member.manage',
			description: 'Convidar, alterar função e remover membros',
		},
		{ key: 'message.read', description: 'Ler mensagens da loja' },
		{ key: 'message.write', description: 'Responder mensagens da loja' },
		{ key: 'review.read', description: 'Ver avaliações da loja' },
		{ key: 'review.reply', description: 'Responder avaliações' },
		{ key: 'stats.read', description: 'Ver desempenho e estatísticas' },
	]

	const permissions = permissionDefs.map((p) => ({
		id: uuidv7(),
		...p,
	}))

	await supabase.from('roles').upsert(roles, { onConflict: 'name' })
	await supabase
		.from('permissions')
		.upsert(permissions, { onConflict: 'key' })

	const { data: insertedRoles } = await supabase.from('roles').select('*')
	const { data: insertedPermissions } = await supabase
		.from('permissions')
		.select('*')

	if (!insertedRoles?.length || !insertedPermissions?.length) {
		throw new Error('Failed to load roles or permissions after upsert')
	}

	const roleMap = Object.fromEntries(insertedRoles.map((r) => [r.name, r.id]))
	const permMap = Object.fromEntries(
		insertedPermissions.map((p) => [p.key, p.id])
	)

	const mustHave = [
		...STORE_PERMISSIONS,
		'order.create',
		'user.read',
		'user.ban',
		'dispute.manage',
	]
	for (const key of mustHave) {
		if (!permMap[key]) {
			throw new Error(`Permission missing after upsert: ${key}`)
		}
	}

	const rolePermissions: Array<{
		role_id: string
		permission_id: string
	}> = [
		...insertedPermissions.map((p) => ({
			role_id: roleMap.admin,
			permission_id: p.id,
		})),
		...insertedPermissions.map((p) => ({
			role_id: roleMap.super_admin,
			permission_id: p.id,
		})),
		{ role_id: roleMap.seller, permission_id: permMap['product.create'] },
		{ role_id: roleMap.seller, permission_id: permMap['product.update'] },
		{ role_id: roleMap.seller, permission_id: permMap['product.delete'] },
		{ role_id: roleMap.seller, permission_id: permMap['product.read'] },
		{ role_id: roleMap.seller, permission_id: permMap['order.read'] },
		{ role_id: roleMap.seller, permission_id: permMap['order.update'] },
		{ role_id: roleMap.seller, permission_id: permMap['store.read'] },
		{ role_id: roleMap.seller, permission_id: permMap['store.update'] },
		{ role_id: roleMap.seller, permission_id: permMap['member.read'] },
		{ role_id: roleMap.seller, permission_id: permMap['member.manage'] },
		{ role_id: roleMap.seller, permission_id: permMap['message.read'] },
		{ role_id: roleMap.seller, permission_id: permMap['message.write'] },
		{ role_id: roleMap.seller, permission_id: permMap['review.read'] },
		{ role_id: roleMap.seller, permission_id: permMap['review.reply'] },
		{ role_id: roleMap.seller, permission_id: permMap['stats.read'] },
		{ role_id: roleMap.buyer, permission_id: permMap['order.create'] },
		{ role_id: roleMap.buyer, permission_id: permMap['order.read'] },
		{ role_id: roleMap.buyer, permission_id: permMap['product.read'] },
		{ role_id: roleMap.support, permission_id: permMap['order.read'] },
		{ role_id: roleMap.support, permission_id: permMap['user.read'] },
		{ role_id: roleMap.support, permission_id: permMap['dispute.manage'] },
		...STORE_OWNER_PERMISSIONS.map((key) => ({
			role_id: roleMap.store_owner,
			permission_id: permMap[key],
		})),
		...STORE_ROLE_UI.manager.permissions.map((key) => ({
			role_id: roleMap.store_manager,
			permission_id: permMap[key],
		})),
		...STORE_ROLE_UI.staff.permissions.map((key) => ({
			role_id: roleMap.store_staff,
			permission_id: permMap[key],
		})),
		...STORE_ROLE_UI.viewer.permissions.map((key) => ({
			role_id: roleMap.store_viewer,
			permission_id: permMap[key],
		})),
	]

	await supabase.from('role_permissions').upsert(rolePermissions, {
		onConflict: 'role_id,permission_id',
		ignoreDuplicates: true,
	})

	console.log('✅ Seed de RBAC concluído (inclui roles store_* + permissões da loja)!')
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('❌ Erro no seed:', err)
		process.exit(1)
	})
