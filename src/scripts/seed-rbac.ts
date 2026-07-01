import './load-env'
import { createSupabaseAdmin } from '../lib/supabase/admin'
import { uuidv7 } from 'uuidv7'

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
	]

	const permissions = [
		{ id: uuidv7(), key: 'product.create', description: 'Criar produtos' },
		{
			id: uuidv7(),
			key: 'product.update',
			description: 'Atualizar produtos',
		},
		{
			id: uuidv7(),
			key: 'product.delete',
			description: 'Excluir produtos',
		},
		{
			id: uuidv7(),
			key: 'product.read',
			description: 'Visualizar produtos',
		},
		{ id: uuidv7(), key: 'order.create', description: 'Criar pedidos' },
		{ id: uuidv7(), key: 'order.read', description: 'Visualizar pedidos' },
		{ id: uuidv7(), key: 'order.update', description: 'Atualizar pedidos' },
		{ id: uuidv7(), key: 'user.read', description: 'Visualizar usuários' },
		{
			id: uuidv7(),
			key: 'user.ban',
			description: 'Banir usuários do sistema',
		},
		{
			id: uuidv7(),
			key: 'dispute.manage',
			description: 'Gerenciar disputas e conflitos',
		},
	]

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

	const rolePermissions = [
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
		{ role_id: roleMap.buyer, permission_id: permMap['order.create'] },
		{ role_id: roleMap.buyer, permission_id: permMap['order.read'] },
		{ role_id: roleMap.buyer, permission_id: permMap['product.read'] },
		{ role_id: roleMap.support, permission_id: permMap['order.read'] },
		{ role_id: roleMap.support, permission_id: permMap['user.read'] },
		{ role_id: roleMap.support, permission_id: permMap['dispute.manage'] },
	]

	await supabase.from('role_permissions').upsert(rolePermissions, {
		onConflict: 'role_id,permission_id',
		ignoreDuplicates: true,
	})

	console.log('✅ Seed de RBAC concluído com sucesso!')
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('❌ Erro no seed:', err)
		process.exit(1)
	})
