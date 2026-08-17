import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireAdminUser } from '@/lib/auth/admin'
import {
	apiError,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { SendAdminNotificationSchema } from '@/lib/validations'

type BatchRow = {
	id: string
	title: string
	body: string
	type: string
	created_at: string
	recipient_count: number | string
	read_count: number | string
}

async function listBatchesFallback(
	supabase: ReturnType<typeof createSupabaseAdmin>
) {
	const { data, error } = await supabase
		.from('notifications')
		.select('id, batch_id, title, body, type, created_at, read_at')
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.limit(1000)
	if (error) throw error
	const grouped = new Map<
		string,
		{
			id: string
			title: string
			body: string
			type: string
			created_at: string
			recipientCount: number
			readCount: number
		}
	>()
	for (const n of data ?? []) {
		const key = n.batch_id ?? n.id
		const existing = grouped.get(key)
		if (existing) {
			existing.recipientCount += 1
			if (n.read_at) existing.readCount += 1
		} else {
			grouped.set(key, {
				id: key,
				title: n.title,
				body: n.body,
				type: n.type,
				created_at: n.created_at,
				recipientCount: 1,
				readCount: n.read_at ? 1 : 0,
			})
		}
	}
	return Array.from(grouped.values())
		.sort((a, b) => b.created_at.localeCompare(a.created_at))
		.slice(0, 50)
}

export const GET = withErrorHandling(async () => {
	await requireAdminUser()
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase.rpc('list_notification_batches', {
		p_limit: 50,
	})
	if (!error && data) {
		return NextResponse.json({
			notifications: (data as BatchRow[]).map((row) => ({
				id: row.id,
				title: row.title,
				body: row.body,
				type: row.type,
				created_at: row.created_at,
				recipientCount: Number(row.recipient_count) || 0,
				readCount: Number(row.read_count) || 0,
			})),
		})
	}
	if (error) {
		console.error('[list_notification_batches]', error.message)
	}
	const notifications = await listBatchesFallback(supabase)
	return NextResponse.json({ notifications })
})

export const POST = withErrorHandling(async (request: NextRequest) => {
	const admin = await requireAdminUser()
	const parsed = SendAdminNotificationSchema.safeParse(await request.json())
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0]?.message ?? 'Dados inválidos'
		)
	}
	const { target, title, body } = parsed.data
	const supabase = createSupabaseAdmin()
	let userIds: string[]
	if (target === 'buyers' || target === 'sellers') {
		const roleName = target === 'buyers' ? 'buyer' : 'seller'
		const { data: roleData } = await supabase
			.from('roles')
			.select('id')
			.eq('name', roleName)
			.maybeSingle()
		if (roleData) {
			const { data: userRoles } = await supabase
				.from('user_roles')
				.select('user_id')
				.eq('role_id', roleData.id)
			userIds = (userRoles ?? []).map((r) => r.user_id)
		} else {
			userIds = []
		}
	} else {
		const { data: users } = await supabase
			.from('users')
			.select('id')
			.is('deleted_at', null)
		userIds = (users ?? []).map((u) => u.id)
	}
	const now = new Date().toISOString()
	const notificationId = uuidv7()
	if (userIds.length === 0) {
		return NextResponse.json({
			success: true,
			notification: {
				id: notificationId,
				target,
				title,
				body,
				sentAt: now,
				sentBy: (admin as { id: string }).id,
			},
			message: 'Nenhum utilizador encontrado para o alvo selecionado.',
		})
	}
	const rows = userIds.map((userId) => ({
		id: uuidv7(),
		batch_id: notificationId,
		user_id: userId,
		sender_user_id: null,
		sender_store_id: null,
		title,
		body,
		type: 'system' as const,
		link: null,
		read_at: null,
		created_at: now,
	}))
	const { error } = await supabase.from('notifications').insert(rows)
	if (error) throw error
	return NextResponse.json({
		success: true,
		notification: {
			id: notificationId,
			target,
			title,
			body,
			sentAt: now,
			sentBy: (admin as { id: string }).id,
		},
		recipientCount: userIds.length,
	})
})
