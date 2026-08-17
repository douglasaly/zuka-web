import { type NextRequest, NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { UpdateAddressInput } from '../types'
export async function PATCH(
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
		const user = await requireSessionUser()
		const supabase = createSupabaseAdmin()
		const { id } = await params
		const body: UpdateAddressInput = await request.json()
		const { data: existing } = await supabase
			.from('addresses')
			.select('id')
			.eq('id', id)
			.eq('user_id', user.id)
			.is('deleted_at', null)
			.maybeSingle()
		if (!existing) {
			return NextResponse.json(
				{ success: false, message: 'Endereço não encontrado' },
				{ status: 404 }
			)
		}
		const updates: Record<string, unknown> = {}
		if (body.label !== undefined) updates.label = body.label.trim()
		if (body.street !== undefined) updates.street = body.street.trim()
		if (body.neighborhood !== undefined)
			updates.neighborhood = body.neighborhood.trim()
		if (body.city !== undefined) updates.city = body.city.trim()
		if (body.provinceSlug !== undefined) {
			if (body.provinceSlug) {
				const { data: province } = await supabase
					.from('provinces')
					.select('name')
					.eq('slug', body.provinceSlug)
					.maybeSingle()
				updates.province = province?.name ?? ''
			} else {
				updates.province = ''
			}
		}
		if (body.isDefault !== undefined) {
			updates.is_default = body.isDefault
			if (body.isDefault) {
				await supabase
					.from('addresses')
					.update({ is_default: false })
					.eq('user_id', user.id)
					.neq('id', id)
					.is('deleted_at', null)
			}
		}
		updates.updated_at = new Date().toISOString()
		const { data, error } = await supabase
			.from('addresses')
			.update(updates as never)
			.eq('id', id)
			.select('*')
			.single()
		if (error) throw error
		const row = data as unknown as {
			id: string
			user_id: string
			label: string
			street: string
			neighborhood: string
			city: string
			province: string
			phone: string
			recipient_name: string
			is_default: boolean
			created_at: string
			updated_at: string
		}
		return NextResponse.json({
			address: {
				id: row.id,
				userId: row.user_id,
				label: row.label,
				street: row.street,
				neighborhood: row.neighborhood,
				city: row.city,
				provinceName: row.province,
				phone: row.phone,
				recipientName: row.recipient_name,
				isDefault: row.is_default,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			},
			success: true,
		})
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{ success: false, message: 'Erro ao atualizar endereço' },
			{ status: 500 }
		)
	}
}
export async function DELETE(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			id: string
		}>
	}
) {
	try {
		const user = await requireSessionUser()
		const supabase = createSupabaseAdmin()
		const { id } = await params
		const { data: existing } = await supabase
			.from('addresses')
			.select('id')
			.eq('id', id)
			.eq('user_id', user.id)
			.is('deleted_at', null)
			.maybeSingle()
		if (!existing) {
			return NextResponse.json(
				{ success: false, message: 'Endereço não encontrado' },
				{ status: 404 }
			)
		}
		const { error } = await supabase
			.from('addresses')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id)
		if (error) throw error
		return NextResponse.json({ success: true })
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{ success: false, message: 'Erro ao remover endereço' },
			{ status: 500 }
		)
	}
}
