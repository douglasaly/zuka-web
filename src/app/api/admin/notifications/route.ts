import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { requireAdminUser } from '@/lib/auth/admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
	await requireAdminUser()

	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('notifications')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(50)

	if (error) {
		return NextResponse.json({ notifications: [] })
	}

	return NextResponse.json({ notifications: data ?? [] })
}

export async function POST(req: Request) {
	const admin = await requireAdminUser()
	const { target, title, body } = await req.json()

	if (!title || !body || !target) {
		return NextResponse.json(
			{ error: 'Missing required fields' },
			{ status: 400 }
		)
	}

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
				.eq('role_id', roleData.id as string)

			userIds = (userRoles ?? []).map(
				(r: { user_id: string }) => r.user_id as string
			)
		} else {
			userIds = []
		}
	} else {
		const { data: users } = await supabase
			.from('users')
			.select('id')
			.is('deleted_at', null)

		userIds = (users ?? []).map((u: { id: string }) => u.id as string)
	}

	if (userIds.length === 0) {
		return NextResponse.json({
			success: true,
			notification: {
				id: uuidv7(),
				target,
				title,
				body,
				sentAt: new Date().toISOString(),
				sentBy: admin.id,
			},
			message: 'Nenhum utilizador encontrado para o alvo selecionado.',
		})
	}

	const now = new Date().toISOString()
	const notificationId = uuidv7()

	const rows = userIds.map((userId) => ({
		id: uuidv7(),
		user_id: userId,
		title,
		body,
		type: 'admin',
		link: null,
		read_at: null,
		created_at: now,
		updated_at: now,
	}))

	const { error } = await supabase.from('notifications').insert(rows)

	if (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Falha ao enviar notificações' },
			{ status: 500 }
		)
	}

	return NextResponse.json({
		success: true,
		notification: {
			id: notificationId,
			target,
			title,
			body,
			sentAt: now,
			sentBy: admin.id,
		},
		recipientCount: userIds.length,
	})
}
