import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireSellerStore } from '@/lib/auth/seller'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { store } = auth
		const db = createSupabaseAdmin()
		const supabase = db as any

		const { data: members, error } = await supabase
			.from('store_members')
			.select(
				'id, role, joined_at, invited_at, created_at, users!inner(id, first_name, last_name, email, avatar_url)'
			)
			.eq('store_id', (store as any).id)
			.is('deleted_at', null)
			.order('created_at', { ascending: true })

		if (error) throw error

		const mapped = ((members ?? []) as any[]).map((member: any) => ({
			id: member.id,
			role: member.role,
			joinedAt: member.joined_at ?? null,
			invitedAt: member.invited_at ?? null,
			user: {
				id: member.users.id,
				firstName: member.users.first_name ?? null,
				lastName: member.users.last_name ?? null,
				email: member.users.email ?? null,
				avatarUrl: member.users.avatar_url ?? null,
			},
		}))

		return NextResponse.json({ members: mapped })
	} catch (error) {
		console.error('[GET /api/seller/members]', error)
		return NextResponse.json(
			{ error: 'Erro ao carregar membros' },
			{ status: 500 }
		)
	}
}

export async function POST(req: Request) {
	try {
		const auth = await requireSellerStore()
		if ('error' in auth && auth.error) return auth.error

		const { store } = auth
		const db = createSupabaseAdmin()
		const supabase = db as any

		const body = (await req.json()) as {
			userId?: string
			email?: string
			role?: string
		}

		if (!body.userId && !body.email) {
			return NextResponse.json(
				{ error: 'Forneça userId ou email' },
				{ status: 400 }
			)
		}

		let targetUserId = body.userId

		if (body.email && !targetUserId) {
			const { data: targetUser } = await supabase
				.from('users')
				.select('id')
				.eq('email', body.email)
				.is('deleted_at', null)
				.maybeSingle()

			if (!targetUser) {
				return NextResponse.json(
					{ error: 'Utilizador não encontrado' },
					{ status: 404 }
				)
			}

			targetUserId = targetUser.id
		}

		const { data: existing } = await supabase
			.from('store_members')
			.select('id')
			.eq('store_id', (store as any).id)
			.eq('user_id', targetUserId)
			.is('deleted_at', null)
			.maybeSingle()

		if (existing) {
			return NextResponse.json(
				{ error: 'Membro já existe na loja' },
				{ status: 409 }
			)
		}

		await supabase.from('store_members').insert({
			id: uuidv7(),
			store_id: (store as any).id,
			user_id: targetUserId,
			role: body.role ?? 'staff',
			invited_at: new Date().toISOString(),
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[POST /api/seller/members]', error)
		return NextResponse.json(
			{ error: 'Erro ao adicionar membro' },
			{ status: 500 }
		)
	}
}
