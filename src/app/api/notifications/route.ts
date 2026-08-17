import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	DeleteNotificationsSchema,
	UpdateNotificationsSchema,
} from '@/lib/validations'
import type { NotificationRow } from '@/types/notifications'

function normalizeLink(link: string | null) {
	if (link?.startsWith('/pedidos/')) return `/feed${link}`
	return link
}
export async function GET(req: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const limit = Math.min(
			Math.max(Number(searchParams.get('limit') ?? 20), 1),
			100
		)
		const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)
		const supabase = createSupabaseAdmin()
		const [{ data, error }, { count: unreadCount, error: unreadError }] =
			await Promise.all([
				supabase
					.from('notifications')
					.select(`
				id,
				user_id,
				type,
				title,
				body,
				link,
				read_at,
				created_at,
				sender_user:users!sender_user_id ( id, first_name, last_name, avatar_url ),
				sender_store:stores!sender_store_id ( id, name, logo_url )
			`)
					.eq('user_id', user.id)
					.is('deleted_at', null)
					.order('created_at', { ascending: false })
					.range(offset, offset + limit - 1),
				supabase
					.from('notifications')
					.select('id', {
						head: true,
						count: 'exact',
					})
					.eq('user_id', user.id)
					.is('deleted_at', null)
					.is('read_at', null),
			])
		if (error) throw error
		if (unreadError) throw unreadError
		const rows = (data ?? []) as NotificationRow[]
		const notifications = rows.map((row) => {
			const sender = row.sender_store
				? {
						type: 'store' as const,
						id: row.sender_store.id,
						name: row.sender_store.name,
						avatarUrl: row.sender_store.logo_url,
					}
				: row.sender_user
					? {
							type: 'user' as const,
							id: row.sender_user.id,
							name: `${row.sender_user.first_name} ${row.sender_user.last_name}`,
							avatarUrl: row.sender_user.avatar_url,
						}
					: null
			return {
				id: row.id,
				userId: row.user_id,
				type: row.type,
				title: row.title,
				body: row.body,
				link: normalizeLink(row.link),
				readAt: row.read_at,
				createdAt: row.created_at,
				sender,
			}
		})
		return NextResponse.json({
			success: true,
			notifications,
			unreadCount: unreadCount ?? 0,
			pagination: {
				limit,
				offset,
				hasMore: notifications.length === limit,
			},
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{
				error: 'Erro ao buscar notificações',
			},
			{
				status: 500,
			}
		)
	}
}
export async function PATCH(req: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const parsed = UpdateNotificationsSchema.safeParse(await req.json())
		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0]?.message ?? 'Pedido inválido' },
				{ status: 400 }
			)
		}
		const { ids, all, read = true, restore } = parsed.data
		const supabase = createSupabaseAdmin()
		const now = new Date().toISOString()
		if (all) {
			const { error } = await supabase
				.from('notifications')
				.update({ read_at: now })
				.eq('user_id', user.id)
				.is('deleted_at', null)
				.is('read_at', null)
			if (error) throw error
			return NextResponse.json({ success: true })
		}
		let query = supabase
			.from('notifications')
			.update(
				restore ? { deleted_at: null } : { read_at: read ? now : null }
			)
			.eq('user_id', user.id)
			.in('id', ids as string[])
		if (!restore) query = query.is('deleted_at', null)
		const { error } = await query
		if (error) throw error
		return NextResponse.json({
			success: true,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{
				error: 'Erro ao actualizar notificações.',
			},
			{
				status: 500,
			}
		)
	}
}
export async function DELETE(req: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const parsed = DeleteNotificationsSchema.safeParse(await req.json())
		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0]?.message ?? 'Pedido inválido' },
				{ status: 400 }
			)
		}
		const supabase = createSupabaseAdmin()
		const { error } = await supabase
			.from('notifications')
			.update({ deleted_at: new Date().toISOString() })
			.eq('user_id', user.id)
			.in('id', parsed.data.ids)
			.is('deleted_at', null)
		if (error) throw error
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{
				error: 'Erro ao remover notificações.',
			},
			{
				status: 500,
			}
		)
	}
}
