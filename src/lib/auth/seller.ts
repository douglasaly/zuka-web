import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import {
	rbacRoleNameForMemberRole,
	STORE_OWNER_PERMISSIONS,
	STORE_ROLE_UI,
	type StorePermission,
} from '@/lib/auth/store-permissions'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

function db(): SupabaseClient {
	return createSupabaseAdmin() as unknown as SupabaseClient
}
export type SellerStoreContext = {
	user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>
	store: {
		id: string
		name: string
		slug: string
		owner_id: string
		status: string | null
	}
	memberRole: string
	rbacRole: string
	permissions: StorePermission[]
	isOwner: boolean
}
export type SellerStoreAuthError = {
	error: NextResponse
}
export type SellerStoreAuthResult = SellerStoreContext | SellerStoreAuthError
export function isSellerStoreAuthError(
	result: SellerStoreAuthResult
): result is SellerStoreAuthError {
	return 'error' in result
}
async function loadPermissionsForRbacRole(
	supabase: SupabaseClient,
	rbacRoleName: string
): Promise<StorePermission[]> {
	const { data: role, error: roleError } = await supabase
		.from('roles')
		.select('id')
		.eq('name', rbacRoleName)
		.maybeSingle()
	if (roleError) throw roleError
	if (!role) {
		return fallbackPermissions(rbacRoleName)
	}
	const { data: rows, error } = await supabase
		.from('role_permissions')
		.select('permissions!inner(key)')
		.eq(
			'role_id',
			(
				role as {
					id: string
				}
			).id
		)
	if (error) throw error
	const keys = (
		(rows ?? []) as Array<{
			permissions:
				| {
						key: string
				  }
				| {
						key: string
				  }[]
		}>
	)
		.map((row) => {
			const p = row.permissions
			if (Array.isArray(p)) return p[0]?.key
			return p?.key
		})
		.filter(Boolean) as string[]
	if (keys.length === 0) return fallbackPermissions(rbacRoleName)
	return keys as StorePermission[]
}
function fallbackPermissions(rbacRoleName: string): StorePermission[] {
	if (rbacRoleName === 'store_owner') return [...STORE_OWNER_PERMISSIONS]
	if (rbacRoleName === 'store_manager')
		return [...STORE_ROLE_UI.manager.permissions]
	if (rbacRoleName === 'store_staff')
		return [...STORE_ROLE_UI.staff.permissions]
	if (rbacRoleName === 'store_viewer')
		return [...STORE_ROLE_UI.viewer.permissions]
	return []
}
const BLOCKED_STORE_STATUSES = new Set(['BANNED', 'SUSPENDED'])
type ResolvedStore = SellerStoreContext['store']
type StoreMembershipRow = {
	role: string
	stores:
		| {
				id: string
				name: string
				slug: string
				owner_id: string
				status: string | null
				deleted_at: string | null
		  }
		| Array<{
				id: string
				name: string
				slug: string
				owner_id: string
				status: string | null
				deleted_at: string | null
		  }>
}
function membershipStore(row: StoreMembershipRow): ResolvedStore | null {
	const storeRow = Array.isArray(row.stores) ? row.stores[0] : row.stores
	if (!storeRow || storeRow.deleted_at) return null
	return {
		id: storeRow.id,
		name: storeRow.name,
		slug: storeRow.slug,
		owner_id: storeRow.owner_id,
		status: storeRow.status,
	}
}
function isBlockedStoreStatus(status: string | null | undefined): boolean {
	return BLOCKED_STORE_STATUSES.has(status ?? '')
}
async function resolveSellerStoreContext(
	supabase: SupabaseClient,
	userId: string
): Promise<{
	store: ResolvedStore
	memberRole: string
	isOwner: boolean
} | null> {
	const [{ data: ownedStores, error: ownedError }, { data: memberships, error: memberError }] =
		await Promise.all([
			supabase
				.from('stores')
				.select('id, name, slug, owner_id, status')
				.eq('owner_id', userId)
				.is('deleted_at', null)
				.order('created_at', { ascending: true }),
			supabase
				.from('store_members')
				.select(`
					role,
					stores!inner (
						id,
						name,
						slug,
						owner_id,
						status,
						deleted_at
					)
				`)
				.eq('user_id', userId)
				.is('deleted_at', null)
				.eq('status', 'active')
				.order('created_at', { ascending: true }),
		])
	if (ownedError) throw ownedError
	if (memberError) throw memberError
	const owned = (ownedStores ?? []) as ResolvedStore[]
	const activeOwned = owned.find((store) => store.status === 'ACTIVE')
	if (activeOwned) {
		return { store: activeOwned, memberRole: 'owner', isOwner: true }
	}
	for (const row of (memberships ?? []) as StoreMembershipRow[]) {
		const store = membershipStore(row)
		if (store?.status === 'ACTIVE') {
			return {
				store,
				memberRole: row.role,
				isOwner: store.owner_id === userId,
			}
		}
	}
	const fallbackOwned = owned.find(
		(store) => !isBlockedStoreStatus(store.status)
	)
	if (fallbackOwned) {
		return { store: fallbackOwned, memberRole: 'owner', isOwner: true }
	}
	for (const row of (memberships ?? []) as StoreMembershipRow[]) {
		const store = membershipStore(row)
		if (store && !isBlockedStoreStatus(store.status)) {
			return {
				store,
				memberRole: row.role,
				isOwner: store.owner_id === userId,
			}
		}
	}
	return null
}
export async function requireSellerStore(options?: {
	permission?: StorePermission | StorePermission[]
}): Promise<SellerStoreAuthResult> {
	const user = await getSessionUser()
	if (!user) {
		return {
			error: NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			),
		}
	}
	const supabase = db()
	const userId = user.id as string
	const resolved = await resolveSellerStoreContext(supabase, userId)
	if (!resolved) {
		return {
			error: NextResponse.json(
				{
					error: 'Crie a sua loja ou peça acesso a um dono de loja no Zuka.',
				},
				{ status: 403 }
			),
		}
	}
	const { store, memberRole, isOwner } = resolved
	const rbacRole =
		rbacRoleNameForMemberRole(isOwner ? 'owner' : memberRole) ??
		'store_viewer'
	const permissions = await loadPermissionsForRbacRole(supabase, rbacRole)
	if (options?.permission) {
		const needed = Array.isArray(options.permission)
			? options.permission
			: [options.permission]
		const missing = needed.filter((p) => !permissions.includes(p))
		if (missing.length > 0) {
			return {
				error: NextResponse.json(
					{
						error: 'Não tem permissão para esta acção na loja.',
						missing,
					},
					{ status: 403 }
				),
			}
		}
	}
	const ctx: SellerStoreContext = {
		user,
		store,
		memberRole: isOwner ? 'owner' : memberRole,
		rbacRole,
		permissions,
		isOwner,
	}
	return ctx
}
export function hasStorePermission(
	ctx: SellerStoreContext,
	permission: StorePermission
) {
	return ctx.permissions.includes(permission)
}
export async function getManagedStoreIds(userId: string): Promise<string[]> {
	const supabase = db()
	const [{ data: owned }, { data: memberships }] = await Promise.all([
		supabase
			.from('stores')
			.select('id')
			.eq('owner_id', userId)
			.is('deleted_at', null),
		supabase
			.from('store_members')
			.select('store_id')
			.eq('user_id', userId)
			.eq('status', 'active')
			.is('deleted_at', null),
	])
	const ids = new Set<string>()
	for (const row of owned ?? []) {
		if (row.id) ids.add(row.id as string)
	}
	for (const row of memberships ?? []) {
		if (row.store_id) ids.add(row.store_id as string)
	}
	return [...ids]
}
