export type MemberUser = {
	id: string
	firstName: string | null
	lastName: string | null
	email: string | null
	avatarUrl: string | null
}

export type Member = {
	id: string
	role: string
	status: string
	joinedAt: string | null
	invitedAt: string | null
	user: MemberUser
}

export type RoleCatalog =
	typeof import('@/lib/auth/store-permissions').STORE_ROLE_UI
export type InviteRole = keyof RoleCatalog

export type MembersResponse = {
	members: Member[]
	me?: {
		userId: string
		memberRole: string
		rbacRole: string
		isOwner: boolean
		permissions: string[]
		canManage: boolean
	}
	roleCatalog?: RoleCatalog
}
