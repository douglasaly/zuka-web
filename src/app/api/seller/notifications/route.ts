import { type NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { getUserRoles } from '@/lib/auth/roles'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { searchParams } = new URL(request.url)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit')) || 20, 1),
			100
		)
		const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

		const supabase = createSupabaseAdmin()

		const { data: notifications, error } = await supabase
			.from('notifications')
			.select(
				`
				id,
				user_id,
				type,
				title,
				body,
				link,
				read_at,
				created_at,
				sender_user:users!sender_user_id (
					id,
					first_name,
					last_name,
					avatar_url
				),
				sender_store:stores!sender_store_id (
					id,
					name,
					logo_url
				)
			`
			)
			.eq('user_id', user.id as string)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.range(offset, offset + limit)

		if (error) throw error

		const { count: unreadCount } = await supabase
			.from('notifications')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', user.id as string)
			.is('read_at', null)
			.is('deleted_at', null)

		const result = (notifications ?? []).map((n: Record<string, unknown>) => {
			const senderUser = n.sender_user as Record<string, unknown> | null
			const senderStore = n.sender_store as Record<string, unknown> | null

			let sender = null
			if (senderStore) {
				sender = {
					type: 'store',
					id: senderStore.id,
					name: senderStore.name,
					avatarUrl: senderStore.logo_url ?? null,
				}
			} else if (senderUser) {
				const firstName = senderUser.first_name ?? ''
				const lastName = senderUser.last_name ?? ''
				sender = {
					type: 'user',
					id: senderUser.id,
					name: [firstName, lastName].filter(Boolean).join(' ') || 'Utilizador',
					avatarUrl: senderUser.avatar_url ?? null,
				}
			}

			return {
				id: n.id,
				userId: n.user_id,
				type: n.type,
				title: n.title,
				body: n.body,
				link: n.link ?? null,
				readAt: n.read_at ?? null,
				createdAt: n.created_at,
				sender,
			}
		})

		const hasMore = (notifications?.length ?? 0) > limit

		return NextResponse.json({
			success: true,
			notifications: result.slice(0, limit),
			unreadCount: unreadCount ?? 0,
			pagination: { limit, offset, hasMore },
		})
	} catch (err) {
		console.error('[GET /api/seller/notifications]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { ids } = await request.json()

		if (!Array.isArray(ids) || ids.length === 0) {
			return NextResponse.json(
				{ error: 'ids é obrigatório' },
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()

		const { error } = await supabase
			.from('notifications')
			.update({ read_at: new Date().toISOString() })
			.in('id', ids)
			.eq('user_id', user.id as string)
			.is('read_at', null)
			.is('deleted_at', null)

		if (error) throw error

		return NextResponse.json({ success: true })
	} catch (err) {
		console.error('[PATCH /api/seller/notifications]', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
