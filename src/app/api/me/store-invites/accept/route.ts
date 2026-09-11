import { type NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const body = (await request.json().catch(() => ({}))) as {
			storeId?: string
		}
		const storeId =
			typeof body.storeId === 'string' ? body.storeId.trim() : ''
		if (!storeId) {
			return NextResponse.json(
				{ error: 'Indica a loja do convite.' },
				{ status: 400 }
			)
		}
		const supabase = createSupabaseAdmin()
		const { data: membership, error: findError } = await supabase
			.from('store_members')
			.select('id, status, deleted_at')
			.eq('store_id', storeId)
			.eq('user_id', user.id as string)
			.is('deleted_at', null)
			.maybeSingle()
		if (findError) throw findError
		const row = membership as {
			id: string
			status: string | null
			deleted_at: string | null
		} | null
		if (!row) {
			return NextResponse.json(
				{ error: 'Convite não encontrado.' },
				{ status: 404 }
			)
		}
		if (row.status === 'active') {
			return NextResponse.json({ success: true, alreadyActive: true })
		}
		if (row.status !== 'pending') {
			return NextResponse.json(
				{ error: 'Este convite já não está disponível.' },
				{ status: 409 }
			)
		}
		const now = new Date().toISOString()
		const { error: updateError } = await supabase
			.from('store_members')
			.update({
				status: 'active',
				joined_at: now,
				updated_at: now,
			})
			.eq('id', row.id)
			.eq('user_id', user.id as string)
			.eq('status', 'pending')
		if (updateError) throw updateError
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[POST /api/me/store-invites/accept]', error)
		return NextResponse.json(
			{ error: 'Não foi possível aceitar o convite' },
			{ status: 500 }
		)
	}
}
