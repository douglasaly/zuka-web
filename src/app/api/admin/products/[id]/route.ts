import type { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import {
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { AdminUpdateProductSchema } from '@/lib/validations'

type ProductUpdate = Database['public']['Tables']['products']['Update']

function toCents(value: number): number {
	return Math.round(value * 100)
}

export const PATCH = withErrorHandling(
	async (request: NextRequest, context) => {
		await requireAdmin()
		const { id } = await context.params
		const body = await request.json()
		const parsed = AdminUpdateProductSchema.safeParse(body)
		if (!parsed.success) {
			return apiError(
				ErrorCode.VALIDATION_ERROR,
				parsed.error.issues[0]?.message ?? 'Dados inválidos'
			)
		}
		const input = parsed.data
		const updates: ProductUpdate = {
			updated_at: new Date().toISOString(),
		}
		if (input.name !== undefined) updates.name = input.name
		if (input.description !== undefined)
			updates.description = input.description
		const categoryId = input.category_id ?? input.categoryId
		if (categoryId !== undefined) updates.category_id = categoryId
		if (input.price !== undefined) updates.price = toCents(input.price)
		const discount = input.discount_price ?? input.discountPrice
		if (discount !== undefined) {
			updates.discount_price = discount == null ? null : toCents(discount)
		}
		if (input.currency !== undefined) updates.currency = input.currency
		if (input.status !== undefined) updates.status = input.status
		const isVisible = input.is_visible ?? input.isVisible
		if (isVisible !== undefined) updates.is_visible = isVisible
		const hasAllowedField = Object.keys(updates).some(
			(key) => key !== 'updated_at'
		)
		if (!hasAllowedField) {
			return apiError(
				ErrorCode.VALIDATION_ERROR,
				'Nenhum campo válido para actualizar'
			)
		}
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('products')
			.update(updates)
			.eq('id', id)
			.is('deleted_at', null)
			.select('id')
			.maybeSingle()
		if (error) throw error
		if (!data) {
			return apiError(ErrorCode.NOT_FOUND, 'Produto não encontrado', 404)
		}
		return apiSuccess({ ok: true })
	}
)

export const DELETE = withErrorHandling(
	async (_request: NextRequest, context) => {
		await requireAdmin()
		const { id } = await context.params
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('products')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id)
			.is('deleted_at', null)
			.select('id')
			.maybeSingle()
		if (error) throw error
		if (!data) {
			return apiError(ErrorCode.NOT_FOUND, 'Produto não encontrado', 404)
		}
		return apiSuccess({ ok: true })
	}
)
