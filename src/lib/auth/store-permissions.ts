/**
 * Store-scoped permission keys (also stored in public.permissions).
 * Global marketplace roles stay in seed-rbac; store team roles use these.
 */

export const STORE_PERMISSIONS = [
	'product.create',
	'product.update',
	'product.delete',
	'product.read',
	'order.read',
	'order.update',
	'store.read',
	'store.update',
	'member.read',
	'member.manage',
	'message.read',
	'message.write',
	'review.read',
	'review.reply',
	'stats.read',
] as const

export type StorePermission = (typeof STORE_PERMISSIONS)[number]

/** store_members.role → roles.name in RBAC */
export const STORE_MEMBER_ROLE_TO_RBAC = {
	owner: 'store_owner',
	manager: 'store_manager',
	staff: 'store_staff',
	viewer: 'store_viewer',
} as const

export type StoreMemberRole = keyof typeof STORE_MEMBER_ROLE_TO_RBAC

export const STORE_RBAC_ROLE_NAMES = [
	'store_owner',
	'store_manager',
	'store_staff',
	'store_viewer',
] as const

/** Human labels + what the owner grants when picking a function */
export const STORE_ROLE_UI: Record<
	Exclude<StoreMemberRole, 'owner'>,
	{ label: string; summary: string; permissions: StorePermission[] }
> = {
	manager: {
		label: 'Gestor',
		summary:
			'Quase tudo: produtos, pedidos, mensagens, avaliações e convidar Equipe. Não altera o dono.',
		permissions: [
			'product.create',
			'product.update',
			'product.delete',
			'product.read',
			'order.read',
			'order.update',
			'store.read',
			'store.update',
			'member.read',
			'member.manage',
			'message.read',
			'message.write',
			'review.read',
			'review.reply',
			'stats.read',
		],
	},
	staff: {
		label: 'Colaborador',
		summary:
			'Operação do dia a dia: produtos, pedidos, mensagens e responder avaliações.',
		permissions: [
			'product.create',
			'product.update',
			'product.read',
			'order.read',
			'order.update',
			'store.read',
			'member.read',
			'message.read',
			'message.write',
			'review.read',
			'review.reply',
			'stats.read',
		],
	},
	viewer: {
		label: 'Visualizador',
		summary: 'Só consulta: ver produtos, pedidos, mensagens e avaliações.',
		permissions: [
			'product.read',
			'order.read',
			'store.read',
			'member.read',
			'message.read',
			'review.read',
			'stats.read',
		],
	},
}

export const STORE_OWNER_PERMISSIONS: StorePermission[] = [
	...STORE_PERMISSIONS,
]

export function rbacRoleNameForMemberRole(
	memberRole: string
): (typeof STORE_RBAC_ROLE_NAMES)[number] | null {
	if (memberRole in STORE_MEMBER_ROLE_TO_RBAC) {
		return STORE_MEMBER_ROLE_TO_RBAC[
			memberRole as StoreMemberRole
		]
	}
	return null
}
