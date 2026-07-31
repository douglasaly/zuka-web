import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { STORE_ROLE_UI } from '@/lib/auth/store-permissions'

/** Current user's store access + permission catalog for UI gating. */
export async function GET() {
	try {
		const auth = await requireSellerStore({ permission: 'store.read' })
		if (isSellerStoreAuthError(auth)) return auth.error

		return NextResponse.json({
			success: true,
			store: {
				id: auth.store.id,
				name: auth.store.name,
				slug: auth.store.slug,
			},
			memberRole: auth.memberRole,
			rbacRole: auth.rbacRole,
			isOwner: auth.isOwner,
			permissions: auth.permissions,
			roleCatalog: STORE_ROLE_UI,
		})
	} catch (error) {
		console.error('[GET /api/seller/access]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar o acesso à loja' },
			{ status: 500 }
		)
	}
}
