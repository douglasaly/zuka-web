import { type NextRequest, NextResponse } from 'next/server'
import { requireSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { CreateAddressInput } from './types'

export async function GET() {
	try {
		const user = await requireSessionUser()
		const supabase = createSupabaseAdmin()

		const { data, error } = await supabase
			.from('addresses')
			.select('*, provinces(name)')
			.eq('user_id', user.id)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })

		if (error) throw error

		const addresses = data.map((a) => ({
			id: a.id,
			userId: a.user_id,
			label: a.label,
			street: a.street,
			neighborhood: a.neighborhood,
			city: a.city,
			provinceId: a.province_id,
			provinceName: a.provinces?.name ?? null,
			isDefault: a.is_default,
			createdAt: a.created_at,
			updatedAt: a.updated_at,
		}))

		return NextResponse.json({ addresses, success: true })
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{
				success: false,
				message: 'Erro ao buscar endereços',
			},
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await requireSessionUser()
		const supabase = createSupabaseAdmin()
		const body: CreateAddressInput = await request.json()

		if (!body.label || !body.street || !body.neighborhood || !body.city) {
			return NextResponse.json(
				{
					success: false,
					message: 'Preencha todos os campos obrigatórios',
				},
				{ status: 400 }
			)
		}

		let provinceId: string | null = null
		if (body.provinceSlug) {
			const { data: province } = await supabase
				.from('provinces')
				.select('id')
				.eq('slug', body.provinceSlug)
				.maybeSingle()

			provinceId = province?.id ?? null
		}

		if (body.isDefault) {
			await supabase
				.from('addresses')
				.update({ is_default: false })
				.eq('user_id', user.id)
				.is('deleted_at', null)
		}

		const { data, error } = await supabase
			.from('addresses')
			.insert({
				user_id: user.id,
				label: body.label,
				street: body.street,
				neighborhood: body.neighborhood,
				city: body.city,
				province_id: provinceId,
				is_default: body.isDefault ?? false,
			})
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

		return NextResponse.json({ address, success: true }, { status: 201 })
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{
				success: false,
				message: 'Erro ao criar endereço',
			},
			{ status: 500 }
		)
	}
}
