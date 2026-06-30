import { NextResponse } from 'next/server'

import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

interface Props {
	params: { id: string }
}

export async function DELETE(_req: Request, { params }: Props) {
	const { id } = await params

	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { error } = await supabase
			.from('saved_items')
			.delete()
			.eq('id', id)
			.eq('user_id', user.id)

		if (error) {
			return NextResponse.json(
				{ error: 'Failed to delete item' },
				{ status: 500 }
			)
		}

		return new NextResponse(null, { status: 204 })
	} catch {
		return NextResponse.json(
			{ error: 'Failed to delete selected item' },
			{ status: 500 }
		)
	}
}

export async function POST(_req: Request, { params }: Props) {
	const { id } = await params

	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const supabase = createSupabaseAdmin()

		const { data: existing } = await supabase
			.from('saved_items')
			.select('id')
			.eq('user_id', user.id)
			.eq('product_id', id)
			.single()

		if (existing) {
			return NextResponse.json(
				{ error: 'Already saved' },
				{ status: 409 }
			)
		}

		const { data, error } = await supabase
			.from('saved_items')
			.insert({
				user_id: user.id,
				product_id: id,
			})
			.select()
			.single()

		if (error) {
			console.error('[create_saved_item]', error)

			return NextResponse.json(
				{ error: 'Failed to save item' },
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			item: data,
		})
	} catch (error) {
		console.error(error)

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
