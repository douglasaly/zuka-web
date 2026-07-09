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
			.select('*')
			.eq('user_id', user.id)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })

		if (error) throw error

		const addresses = (data ?? []).map((a) => {
			const row = a as unknown as {
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
			return {
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
			}
		})

		return NextResponse.json({ addresses, success: true })
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{ success: false, message: 'Erro ao buscar endereços' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await requireSessionUser()
		const supabase = createSupabaseAdmin()
		const body: CreateAddressInput = await request.json()

		if (
			!body.label?.trim() ||
			!body.street?.trim() ||
			!body.neighborhood?.trim() ||
			!body.city?.trim() ||
			!body.phone?.trim() ||
			!body.recipientName?.trim()
		) {
			return NextResponse.json(
				{
					success: false,
					message: 'Preencha todos os campos obrigatórios',
				},
				{ status: 400 }
			)
		}

		let provinceName: string | null = null
		if (body.provinceSlug) {
			const { data: province } = await supabase
				.from('provinces')
				.select('name')
				.eq('slug', body.provinceSlug)
				.maybeSingle()

			provinceName = province?.name ?? null
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
				label: body.label.trim(),
				street: body.street.trim(),
				neighborhood: body.neighborhood.trim(),
				city: body.city.trim(),
				province: provinceName ?? '',
				phone: body.phone.trim(),
				recipient_name: body.recipientName.trim(),
				is_default: body.isDefault ?? false,
			})
			.select('*')
			.single()

		if (error) throw error

		return NextResponse.json(
			{
				address: {
					id: data.id,
					userId: data.user_id,
					label: data.label,
					street: data.street,
					neighborhood: data.neighborhood,
					city: data.city,
					provinceName: data.province,
					phone: data.phone,
					recipientName: data.recipient_name,
					isDefault: data.is_default,
					createdAt: data.created_at,
					updatedAt: data.updated_at,
				},
				success: true,
			},
			{ status: 201 }
		)
	} catch (error) {
		if (error instanceof Response) return error
		return NextResponse.json(
			{ success: false, message: 'Erro ao criar endereço' },
			{ status: 500 }
		)
	}
}
