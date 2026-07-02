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
		.limit(1000)

	if (error) {
		return NextResponse.json({ notifications: [] })
	}

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

	const notifications = Array.from(grouped.values())
		.sort((a, b) => b.created_at.localeCompare(a.created_at))
		.slice(0, 50)

	return NextResponse.json({ notifications })
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
		batch_id: notificationId,
		user_id: userId,
		sender_user_id: null, // ou o admin.id se fizer sentido
		sender_store_id: null, // preenche quando a origem for uma loja/seller
		title,
		body,
		type: 'system' as const,
		link: null,
		read_at: null,
		created_at: now,
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
