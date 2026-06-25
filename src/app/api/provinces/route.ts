import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	try {
		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('provinces')
			.select('*')
			.order('name')

		if (error) {
			throw error
		}

		return NextResponse.json(data ?? [])
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar províncias',
			},
			{ status: 500 }
		)
	}
}
