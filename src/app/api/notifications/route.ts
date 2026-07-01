import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { NotificationRow } from '@/types/notifications'

export async function GET(req: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(req.url)
		const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100)

		const supabase = createSupabaseAdmin()
		const { data, error } = await supabase
			.from('notifications')
			.select('*')
			.eq('user_id', user.id as string)
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(limit)

		if (error) throw error

		const rows = (data ?? []) as NotificationRow[]
		const notifications = rows.map((r) => ({
			id: r.id,
			userId: r.user_id,
			title: r.title,
			body: r.body,
			type: r.type,
			link: r.link,
			readAt: r.read_at,
			createdAt: r.created_at,
		}))

		const unreadCount = notifications.filter((n) => !n.readAt).length

		return NextResponse.json({ success: true, notifications, unreadCount })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Erro ao buscar notificações' },
			{ status: 500 }
		)
	}
}

export async function PATCH(req: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { ids } = await req.json()

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
			.eq('user_id', user.id as string)
			.in('id', ids)
			.is('deleted_at', null)

		if (error) throw error

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Erro ao marcar notificações como lidas' },
			{ status: 500 }
		)
	}
}
