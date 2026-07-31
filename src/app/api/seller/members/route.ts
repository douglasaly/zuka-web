import { type NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { uuidv7 } from 'uuidv7'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { STORE_ROLE_UI } from '@/lib/auth/store-permissions'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

/** store_members may lag generated Database types — do not edit types.ts. */
function db(): SupabaseClient {
	return createSupabaseAdmin() as unknown as SupabaseClient
}

const INVITE_ROLES = new Set(['manager', 'staff', 'viewer'])

const ROLE_LABELS: Record<string, string> = {
	manager: 'Gestor',
	staff: 'Colaborador',
	viewer: 'Visualizador',
}

type MemberRow = {
	id: string
	role: string
	status: string | null
	joined_at: string | null
	invited_at: string | null
	created_at: string | null
	users: {
		id: string
		first_name: string | null
		last_name: string | null
		email: string | null
		avatar_url: string | null
	}
}

function mapMember(member: MemberRow) {
	return {
		id: member.id,
		role: member.role,
		status: member.status ?? (member.joined_at ? 'active' : 'pending'),
		joinedAt: member.joined_at ?? null,
		invitedAt: member.invited_at ?? null,
		user: {
			id: member.users.id,
			firstName: member.users.first_name ?? null,
			lastName: member.users.last_name ?? null,
			email: member.users.email ?? null,
			avatarUrl: member.users.avatar_url ?? null,
		},
	}
}

async function notifyMemberInvited(
	supabase: SupabaseClient,
	opts: {
		targetUserId: string
		store: { id: string; name: string }
		role: string
	}
) {
	const roleLabel = ROLE_LABELS[opts.role] ?? opts.role
	const { error } = await supabase.from('notifications').insert({
		id: uuidv7(),
		user_id: opts.targetUserId,
		type: 'system',
		title: `Foste adicionado a ${opts.store.name}`,
		body: `Passaste a fazer parte da equipa da loja como ${roleLabel}. Abre o painel do vendedor para começar.`,
		link: '/dashboard/seller',
		sender_store_id: opts.store.id,
	})

	if (error) {
		console.error(
			'[POST /api/seller/members] invite notification',
			error
		)
	}
}

export async function GET() {
	try {
		const auth = await requireSellerStore({ permission: 'member.read' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { store } = auth
		const supabase = db()

		const { data: members, error } = await supabase
			.from('store_members')
			.select(
				`
				id,
				role,
				status,
				joined_at,
				invited_at,
				created_at,
				users!store_members_user_id_fkey!inner (
					id,
					first_name,
					last_name,
					email,
					avatar_url
				)
			`
			)
			.eq('store_id', store.id)
			.is('deleted_at', null)
			.neq('status', 'removed')
			.order('created_at', { ascending: true })

		if (error) throw error

		const mapped = ((members ?? []) as unknown as MemberRow[]).map(
			mapMember
		)

		return NextResponse.json({
			success: true,
			members: mapped,
			me: {
				userId: auth.user.id as string,
				memberRole: auth.memberRole,
				rbacRole: auth.rbacRole,
				isOwner: auth.isOwner,
				permissions: auth.permissions,
				canManage: auth.permissions.includes('member.manage'),
			},
			roleCatalog: STORE_ROLE_UI,
		})
	} catch (error) {
		console.error('[GET /api/seller/members]', error)
		return NextResponse.json(
			{ error: 'Não foi possível carregar os membros' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const auth = await requireSellerStore({ permission: 'member.manage' })
		if (isSellerStoreAuthError(auth)) return auth.error
		const { user, store } = auth
		const supabase = db()

		const body = (await request.json().catch(() => ({}))) as {
			userId?: string
			email?: string
			role?: string
		}

		const email = typeof body.email === 'string' ? body.email.trim() : ''
		const userId =
			typeof body.userId === 'string' ? body.userId.trim() : ''

		if (!userId && !email) {
			return NextResponse.json(
				{ error: 'Indica o email do utilizador a convidar.' },
				{ status: 400 }
			)
		}

		const role = (body.role ?? 'staff').toLowerCase()
		if (!INVITE_ROLES.has(role)) {
			return NextResponse.json(
				{
					error: 'Função inválida. Usa gestor, colaborador ou visualizador.',
				},
				{ status: 400 }
			)
		}

		let targetUserId = userId || null

		if (email && !targetUserId) {
			const { data: targetUser, error: userError } = await supabase
				.from('users')
				.select('id')
				.eq('email', email)
				.is('deleted_at', null)
				.maybeSingle()

			if (userError) throw userError
			if (!targetUser) {
				return NextResponse.json(
					{
						error: 'Não encontrámos uma conta Zuka com este email.',
					},
					{ status: 404 }
				)
			}
			targetUserId = (targetUser as { id: string }).id
		}

		if (!targetUserId) {
			return NextResponse.json(
				{ error: 'Utilizador inválido.' },
				{ status: 400 }
			)
		}

		if (targetUserId === store.owner_id) {
			return NextResponse.json(
				{ error: 'O dono da loja já faz parte da Equipe.' },
				{ status: 409 }
			)
		}

		const { data: existing } = await supabase
			.from('store_members')
			.select('id, deleted_at, status')
			.eq('store_id', store.id)
			.eq('user_id', targetUserId)
			.maybeSingle()

		const existingRow = existing as {
			id: string
			deleted_at: string | null
			status: string | null
		} | null

		const now = new Date().toISOString()

		if (existingRow && !existingRow.deleted_at) {
			return NextResponse.json(
				{ error: 'Esta pessoa já é membro da loja.' },
				{ status: 409 }
			)
		}

		if (existingRow?.deleted_at) {
			const { error: reviveError } = await supabase
				.from('store_members')
				.update({
					role,
					status: 'active',
					invited_by: user.id,
					invited_at: now,
					joined_at: now,
					deleted_at: null,
					updated_at: now,
				})
				.eq('id', existingRow.id)

			if (reviveError) throw reviveError

			await notifyMemberInvited(supabase, {
				targetUserId,
				store: { id: store.id, name: store.name },
				role,
			})

			return NextResponse.json({ success: true, revived: true })
		}

		const { error: insertError } = await supabase
			.from('store_members')
			.insert({
				id: uuidv7(),
				store_id: store.id,
				user_id: targetUserId,
				role,
				status: 'active',
				invited_by: user.id,
				invited_at: now,
				joined_at: now,
				created_at: now,
				updated_at: now,
			})

		if (insertError) throw insertError

		await notifyMemberInvited(supabase, {
			targetUserId,
			store: { id: store.id, name: store.name },
			role,
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[POST /api/seller/members]', error)
		return NextResponse.json(
			{ error: 'Não foi possível adicionar o membro' },
			{ status: 500 }
		)
	}
}
