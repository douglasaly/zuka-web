import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		if (!id) {
			return NextResponse.json(
				{ success: false, message: 'ID not provided.' },
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('products')
			.select('*, stores(*), categories(*), product_images(*)')
			.eq('id', id)
			.eq('is_visible', true)
			.is('deleted_at', null)
			.maybeSingle()

		if (error) {
			throw error
		}

		if (!data) {
			return NextResponse.json(
				{ success: false, message: 'Produto não encontrado' },
				{ status: 404 }
			)
		}

		const row = data as Record<string, unknown>
		const { stores, categories, product_images, ...product } = row

		return NextResponse.json({
			success: true,
			data: {
				product,
				store: stores,
				category: categories,
				images: product_images ?? [],
			},
		})
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar produto',
			},
			{ status: 500 }
		)
	}
}
