import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import {
	createdAtIdCursorFilter,
	encodeCreatedAtIdCursor,
} from '@/lib/api/cursor-pagination'
import {
	apiError,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import {
	CursorPaginationSchema,
	DeleteNotificationsSchema,
	OffsetPaginationSchema,
	UpdateNotificationsSchema,
} from '@/lib/validations'
import type { NotificationRow } from '@/types/notifications'

function normalizeLink(link: string | null) {
	if (link?.startsWith('/pedidos/')) return `/feed${link}`
	return link
}

const NOTIFICATION_SELECT = `
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
`

function mapRows(rows: NotificationRow[]) {
	return rows.map((row) => {
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
}

export const GET = withErrorHandling(async (request: NextRequest) => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const { searchParams } = new URL(request.url)
	const parsedCursor = CursorPaginationSchema.safeParse({
		limit: searchParams.get('limit') ?? 20,
		cursor: searchParams.get('cursor') || undefined,
	})
	const parsedOffset = OffsetPaginationSchema.safeParse({
		limit: searchParams.get('limit') ?? 20,
		offset: searchParams.get('offset') ?? 0,
	})
	if (!parsedCursor.success || !parsedOffset.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsedCursor.error?.issues[0]?.message ??
				parsedOffset.error?.issues[0]?.message ??
				'Pedido inválido'
		)
	}
	const { limit, cursor } = parsedCursor.data
	const { offset } = parsedOffset.data
	const supabase = createSupabaseAdmin()
	let listQuery = supabase
		.from('notifications')
		.select(NOTIFICATION_SELECT)
		.eq('user_id', user.id)
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.order('id', { ascending: false })
	if (cursor) {
		listQuery = listQuery
			.or(createdAtIdCursorFilter(cursor))
			.limit(limit + 1)
	} else {
		listQuery = listQuery.range(offset, offset + limit - 1)
	}
	const [{ data, error }, { count: unreadCount, error: unreadError }] =
		await Promise.all([
			listQuery,
			supabase
				.from('notifications')
				.select('id', { head: true, count: 'exact' })
				.eq('user_id', user.id)
				.is('deleted_at', null)
				.is('read_at', null),
		])
	if (error) throw error
	if (unreadError) throw unreadError
	const rows = (data ?? []) as NotificationRow[]
	const hasMore = cursor ? rows.length > limit : rows.length === limit
	const pageRows = cursor && hasMore ? rows.slice(0, limit) : rows
	const notifications = mapRows(pageRows)
	const last = notifications[notifications.length - 1]
	return NextResponse.json({
		success: true,
		notifications,
		unreadCount: unreadCount ?? 0,
		pagination: {
			limit,
			offset: cursor ? 0 : offset,
			hasMore,
			nextCursor:
				hasMore && last?.createdAt && last?.id
					? encodeCreatedAtIdCursor(last.createdAt, last.id)
					: null,
		},
	})
})

export const PATCH = withErrorHandling(async (request: NextRequest) => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const parsed = UpdateNotificationsSchema.safeParse(await request.json())
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0]?.message ?? 'Pedido inválido'
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
		.update(restore ? { deleted_at: null } : { read_at: read ? now : null })
		.eq('user_id', user.id)
		.in('id', ids as string[])
	if (!restore) query = query.is('deleted_at', null)
	const { error } = await query
	if (error) throw error
	return NextResponse.json({ success: true })
})

export const DELETE = withErrorHandling(async (request: NextRequest) => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const parsed = DeleteNotificationsSchema.safeParse(await request.json())
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0]?.message ?? 'Pedido inválido'
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
})
