'use client'
import { useQuery } from '@tanstack/react-query'
import type { StorePermission } from '@/lib/auth/store-permissions'
import { STORE_ROLE_UI } from '@/lib/auth/store-permissions'
export type SellerAccess = {
	store: {
		id: string
		name: string
		slug: string
	}
	memberRole: string
	rbacRole: string
	isOwner: boolean
	permissions: StorePermission[]
	roleCatalog: typeof STORE_ROLE_UI
}
export function useSellerAccess() {
	const query = useQuery<SellerAccess>({
		queryKey: ['seller-access'],
		queryFn: async () => {
			const res = await fetch('/api/seller/access')
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error ?? 'Failed to load store access')
			}
			const json = await res.json()
			return {
				store: json.store,
				memberRole: json.memberRole,
				rbacRole: json.rbacRole,
				isOwner: Boolean(json.isOwner),
				permissions: (json.permissions ?? []) as StorePermission[],
				roleCatalog: json.roleCatalog ?? STORE_ROLE_UI,
			}
		},
		staleTime: 60000,
	})
	const permissions = query.data?.permissions ?? []
	function can(permission: StorePermission) {
		return permissions.includes(permission)
	}
	return {
		...query,
		permissions,
		can,
		isOwner: query.data?.isOwner ?? false,
		memberRole: query.data?.memberRole,
		roleCatalog: query.data?.roleCatalog ?? STORE_ROLE_UI,
	}
}
