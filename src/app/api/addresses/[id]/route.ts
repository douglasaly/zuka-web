import { type NextRequest, NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { UpdateAddressInput } from '../types'

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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
		if (body.label !== undefined) updates.label = body.label
		if (body.street !== undefined) updates.street = body.street
		if (body.neighborhood !== undefined)
			updates.neighborhood = body.neighborhood
		if (body.city !== undefined) updates.city = body.city
		if (body.provinceSlug !== undefined) {
			const { data: province } = await supabase
				.from('provinces')
				.select('id')
				.eq('slug', body.provinceSlug)
				.maybeSingle()

			updates.province_id = province?.id ?? null
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
			.update(updates)
			.eq('id', id)
			.select('*, provinces(name)')
			.single()

		if (error) throw error

		const address = {
			id: data.id,
			userId: data.user_id,
			label: data.label,
			street: data.street,
			neighborhood: data.neighborhood,
			city: data.city,
			provinceId: data.province_id,
			provinceName: data.provinces?.name ?? null,
			isDefault: data.is_default,
			createdAt: data.created_at,
			updatedAt: data.updated_at,
		}

		return NextResponse.json({ address, success: true })
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{
				success: false,
				message: 'Erro ao atualizar endereço',
			},
			{ status: 500 }
		)
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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
			{
				success: false,
				message: 'Erro ao remover endereço',
			},
			{ status: 500 }
		)
	}
}
