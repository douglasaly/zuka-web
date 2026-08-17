import type { SupabaseClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

function db(): SupabaseClient {
	return createSupabaseAdmin() as unknown as SupabaseClient
}
const EDITABLE_ROLES = new Set(['manager', 'staff', 'viewer'])
type Params = {
	params: Promise<{
		id: string
	}>
}
export async function PATCH(request: NextRequest, { params }: Params) {
	try {
		const { id } = await params
		const auth = await requireSellerStore({ permission: 'member.manage' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const supabase = db()
		const body = (await request.json().catch(() => ({}))) as {
			role?: string
		}
		const role =
			typeof body.role === 'string' ? body.role.toLowerCase() : ''
		if (!EDITABLE_ROLES.has(role)) {
			return NextResponse.json(
				{ error: 'Função inválida.' },
				{ status: 400 }
			)
		}
		const { data: member, error: findError } = await supabase
			.from('store_members')
			.select('id, role, user_id, deleted_at')
			.eq('id', id)
			.eq('store_id', store.id)
			.maybeSingle()
		if (findError) throw findError
		const row = member as {
			id: string
			role: string
			user_id: string
			deleted_at: string | null
		} | null
		if (!row || row.deleted_at) {
			return NextResponse.json(
				{ error: 'Membro não encontrado' },
				{ status: 404 }
			)
		}
		if (row.role === 'owner' || row.user_id === store.owner_id) {
			return NextResponse.json(
				{ error: 'Não é possível alterar a função do dono.' },
				{ status: 403 }
			)
		}
		const now = new Date().toISOString()
		const { error: updateError } = await supabase
			.from('store_members')
			.update({ role, updated_at: now })
			.eq('id', id)
			.eq('store_id', store.id)
		if (updateError) throw updateError
		return NextResponse.json({ success: true, role })
	} catch (error) {
		console.error('[PATCH /api/seller/members/:id]', error)
		return NextResponse.json(
			{ error: 'Não foi possível actualizar a função' },
			{ status: 500 }
		)
	}
}
export async function DELETE(_request: NextRequest, { params }: Params) {
	try {
		const { id } = await params
		const auth = await requireSellerStore({ permission: 'member.manage' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const supabase = db()
		const { data: member, error: findError } = await supabase
			.from('store_members')
			.select('id, role, user_id, deleted_at')
			.eq('id', id)
			.eq('store_id', store.id)
			.maybeSingle()
		if (findError) throw findError
		const row = member as {
			id: string
			role: string
			user_id: string
			deleted_at: string | null
		} | null
		if (!row || row.deleted_at) {
			return NextResponse.json(
				{ error: 'Membro não encontrado' },
				{ status: 404 }
			)
		}
		if (row.role === 'owner' || row.user_id === store.owner_id) {
			return NextResponse.json(
				{ error: 'Não é possível remover o dono da loja.' },
				{ status: 403 }
			)
		}
		const now = new Date().toISOString()
		const { error: deleteError } = await supabase
			.from('store_members')
			.update({
				deleted_at: now,
				status: 'removed',
				updated_at: now,
			})
			.eq('id', id)
			.eq('store_id', store.id)
		if (deleteError) throw deleteError
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[DELETE /api/seller/members/:id]', error)
		return NextResponse.json(
			{ error: 'Não foi possível remover o membro' },
			{ status: 500 }
		)
	}
}
