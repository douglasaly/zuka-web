import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
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
			isOwner: auth.isOwner,
			memberRole: auth.memberRole,
			rbacRole: auth.rbacRole,
			permissions: auth.permissions,
		})
	} catch (error) {
		console.error('[GET /api/seller/access]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar o acesso à loja' },
			{ status: 500 }
		)
	}
}
