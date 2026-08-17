import { NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
export async function POST(req: Request) {
	try {
		const auth = await requireSellerStore({ permission: 'product.update' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const body = (await req.json()) as {
			action: 'delete' | 'activate' | 'deactivate'
			ids: string[]
		}
		if (!Array.isArray(body.ids) || body.ids.length === 0) {
			return NextResponse.json(
				{ error: 'Nenhum produto seleccionado' },
				{ status: 400 }
			)
		}
		const supabase = createSupabaseAdmin()
		const { data: products } = await supabase
			.from('products')
			.select('id')
			.in('id', body.ids)
			.eq('store_id', store.id as string)
			.is('deleted_at', null)
		if (!products || products.length === 0) {
			return NextResponse.json(
				{ error: 'Produtos não encontrados' },
				{ status: 404 }
			)
		}
		const validIds = products.map((p) => p.id as string)
		switch (body.action) {
			case 'delete': {
				const { error } = await supabase
					.from('products')
					.update({ deleted_at: new Date().toISOString() })
					.in('id', validIds)
				if (error) throw error
				break
			}
			case 'activate': {
				const { error } = await supabase
					.from('products')
					.update({ status: 'ACTIVE' as const, is_visible: true })
					.in('id', validIds)
				if (error) throw error
				break
			}
			case 'deactivate': {
				const { error } = await supabase
					.from('products')
					.update({ status: 'INACTIVE' as const, is_visible: false })
					.in('id', validIds)
				if (error) throw error
				break
			}
			default:
				return NextResponse.json(
					{ error: 'Acção inválida' },
					{ status: 400 }
				)
		}
		return NextResponse.json({
			success: true,
			affected: validIds.length,
		})
	} catch (error) {
		console.error('[POST /api/seller/products/bulk]', error)
		return NextResponse.json(
			{ error: 'Erro ao executar acção em massa' },
			{ status: 500 }
		)
	}
}
