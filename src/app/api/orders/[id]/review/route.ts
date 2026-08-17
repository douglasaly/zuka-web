import { type NextRequest, NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

type ProductReviewInput = {
	productId: string
	rating: number
	body?: string | null
}
function parseRating(value: unknown): number | null {
	const n = typeof value === 'number' ? value : Number(value)
	if (!Number.isInteger(n) || n < 1 || n > 5) return null
	return n
}
function parseBody(value: unknown): string | null {
	if (value == null) return null
	if (typeof value !== 'string') return null
	const trimmed = value.trim()
	if (!trimmed) return null
	return trimmed.slice(0, 2000)
}
export async function POST(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			id: string
		}>
	}
) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const { id: orderId } = await params
		const payload = await request.json().catch(() => null)
		if (!payload || typeof payload !== 'object') {
			return NextResponse.json(
				{ error: 'Pedido de avaliação inválido.' },
				{ status: 400 }
			)
		}
		const storeRating = parseRating(
			(
				payload as {
					storeRating?: unknown
				}
			).storeRating
		)
		const storeBody = parseBody(
			(
				payload as {
					storeBody?: unknown
				}
			).storeBody
		)
		const rawProducts = (
			payload as {
				products?: unknown
			}
		).products
		if (storeRating == null) {
			return NextResponse.json(
				{ error: 'Escolhe uma nota de 1 a 5 para a loja.' },
				{ status: 400 }
			)
		}
		if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
			return NextResponse.json(
				{ error: 'Avalia pelo menos um produto do pedido.' },
				{ status: 400 }
			)
		}
		const products: ProductReviewInput[] = []
		for (const item of rawProducts) {
			if (!item || typeof item !== 'object') {
				return NextResponse.json(
					{ error: 'Dados do produto inválidos.' },
					{ status: 400 }
				)
			}
			const productId =
				typeof (
					item as {
						productId?: unknown
					}
				).productId === 'string'
					? (
							item as {
								productId: string
							}
						).productId.trim()
					: ''
			const rating = parseRating(
				(
					item as {
						rating?: unknown
					}
				).rating
			)
			const body = parseBody(
				(
					item as {
						body?: unknown
					}
				).body
			)
			if (!productId || rating == null) {
				return NextResponse.json(
					{ error: 'Cada produto precisa de uma nota de 1 a 5.' },
					{ status: 400 }
				)
			}
			products.push({ productId, rating, body })
		}
		const productIds = products.map((p) => p.productId)
		if (new Set(productIds).size !== productIds.length) {
			return NextResponse.json(
				{ error: 'Há produtos repetidos na avaliação.' },
				{ status: 400 }
			)
		}
		const supabase = createSupabaseAdmin()
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.select(`
				id,
				buyer_id,
				store_id,
				status,
				review_eligible,
				order_items ( product_id )
			`)
			.eq('id', orderId)
			.eq('buyer_id', user.id as string)
			.is('deleted_at', null)
			.maybeSingle()
		if (orderError) throw orderError
		if (!order) {
			return NextResponse.json(
				{ error: 'Pedido não encontrado.' },
				{ status: 404 }
			)
		}
		if (order.status !== 'COMPLETED') {
			return NextResponse.json(
				{
					error: 'Só podes avaliar depois de o pedido estar entregue.',
				},
				{ status: 400 }
			)
		}
		if (!order.review_eligible) {
			return NextResponse.json(
				{ error: 'Este pedido já foi avaliado.' },
				{ status: 409 }
			)
		}
		const orderProductIds = new Set(
			(
				(order.order_items ?? []) as Array<{
					product_id: string | null
				}>
			)
				.map((item) => item.product_id)
				.filter((id): id is string => Boolean(id))
		)
		if (orderProductIds.size === 0) {
			return NextResponse.json(
				{ error: 'Este pedido não tem produtos para avaliar.' },
				{ status: 400 }
			)
		}
		for (const productId of orderProductIds) {
			if (!products.some((p) => p.productId === productId)) {
				return NextResponse.json(
					{ error: 'Avalia todos os produtos do pedido.' },
					{ status: 400 }
				)
			}
		}
		for (const product of products) {
			if (!orderProductIds.has(product.productId)) {
				return NextResponse.json(
					{ error: 'Um dos produtos não pertence a este pedido.' },
					{ status: 400 }
				)
			}
		}
		const reviewId = uuidv7()
		const now = new Date().toISOString()
		const { error: reviewError } = await supabase.from('reviews').insert({
			id: reviewId,
			order_id: orderId,
			buyer_id: user.id as string,
			store_id: order.store_id,
			rating: storeRating,
			body: storeBody,
			is_visible: true,
			created_at: now,
			updated_at: now,
		})
		if (reviewError) {
			if (reviewError.code === '23505') {
				return NextResponse.json(
					{ error: 'Este pedido já foi avaliado.' },
					{ status: 409 }
				)
			}
			throw reviewError
		}
		const productRows = products.map((product) => ({
			id: uuidv7(),
			review_id: reviewId,
			product_id: product.productId,
			rating: product.rating,
			body: product.body,
			is_visible: true,
			created_at: now,
			updated_at: now,
		}))
		const { error: productsError } = await supabase
			.from('review_products')
			.insert(productRows)
		if (productsError) {
			await supabase.from('reviews').delete().eq('id', reviewId)
			throw productsError
		}
		return NextResponse.json({
			success: true,
			reviewId,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Não foi possível enviar a avaliação.' },
			{ status: 500 }
		)
	}
}
