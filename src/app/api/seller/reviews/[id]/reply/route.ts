import { type NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

function db(): SupabaseClient {
	return createSupabaseAdmin() as unknown as SupabaseClient
}

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
	try {
		const { id } = await params
		const auth = await requireSellerStore({ permission: 'review.reply' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth

		const body = await request.json().catch(() => ({}))
		const reply = typeof body.reply === 'string' ? body.reply.trim() : ''

		if (!reply) {
			return NextResponse.json(
				{ error: 'Escreva uma resposta antes de enviar.' },
				{ status: 400 }
			)
		}
		if (reply.length > 2000) {
			return NextResponse.json(
				{
					error: 'A resposta é demasiado longa (máx. 2000 caracteres).',
				},
				{ status: 400 }
			)
		}

		const supabase = db()

		const { data: review, error: findError } = await supabase
			.from('reviews')
			.select('id, store_id, store_reply, deleted_at')
			.eq('id', id)
			.eq('store_id', store.id)
			.maybeSingle()

		if (findError) throw findError

		const found = review as {
			id: string
			store_reply: string | null
			deleted_at: string | null
		} | null

		if (!found || found.deleted_at) {
			return NextResponse.json(
				{ error: 'Avaliação não encontrada' },
				{ status: 404 }
			)
		}
		if (found.store_reply) {
			return NextResponse.json(
				{ error: 'Esta avaliação já tem resposta.' },
				{ status: 409 }
			)
		}

		const now = new Date().toISOString()
		const { data: updated, error: updateError } = await supabase
			.from('reviews')
			.update({
				store_reply: reply,
				store_replied_at: now,
				updated_at: now,
			})
			.eq('id', id)
			.eq('store_id', store.id)
			.select('id, store_reply, store_replied_at')
			.single()

		if (updateError) throw updateError

		const row = updated as {
			store_reply: string
			store_replied_at: string
		}

		return NextResponse.json({
			success: true,
			reply: row.store_reply,
			repliedAt: row.store_replied_at,
		})
	} catch (error) {
		console.error('[POST /api/seller/reviews/:id/reply]', error)
		return NextResponse.json(
			{ error: 'Não foi possível guardar a resposta' },
			{ status: 500 }
		)
	}
}
