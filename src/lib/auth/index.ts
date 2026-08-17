import { cookies } from 'next/headers'
import { getUserRoles } from '@/lib/auth/roles'
import { getManagedStoreIds } from '@/lib/auth/seller'
import { adminAuth } from '@/lib/firebase/firebase-admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { SESSION_COOKIE } from '@/utils/constants'

type UserRow = Database['public']['Tables']['users']['Row']
export type AuthenticatedAuth = {
	authenticated: true
	user: UserRow
	uid: string
}
export type UnauthenticatedAuth = {
	authenticated: false
}
export type Auth = AuthenticatedAuth | UnauthenticatedAuth
export type SellerAuth = AuthenticatedAuth & {
	store: {
		id: string
		name: string
		slug: string
		owner_id: string
		status: string | null
	}
}
export type AdminAuth = AuthenticatedAuth & {
	roles: string[]
}
async function getFirebaseUid(): Promise<string | null> {
	try {
		const session = (await cookies()).get(SESSION_COOKIE)?.value
		if (!session) return null
		const decoded = await adminAuth.verifySessionCookie(session, true)
		return decoded.uid
	} catch {
		return null
	}
}
async function getUserByFirebaseUid(
	firebaseUid: string
): Promise<UserRow | null> {
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('users')
		.select('*')
		.eq('firebase_uid', firebaseUid)
		.maybeSingle()
	if (error) throw error
	return data
}
async function getStoreByOwnerId(ownerId: string) {
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('stores')
		.select('id, name, slug, owner_id, status')
		.eq('owner_id', ownerId)
		.is('deleted_at', null)
		.order('created_at', { ascending: true })
		.limit(1)
		.maybeSingle()
	if (error) throw error
	return data
}
export async function getAuth(): Promise<Auth> {
	const firebaseUid = await getFirebaseUid()
	if (!firebaseUid) return { authenticated: false }
	const user = await getUserByFirebaseUid(firebaseUid)
	if (!user || user.deleted_at) return { authenticated: false }
	return { authenticated: true, user, uid: firebaseUid }
}
export async function requireAuth(): Promise<AuthenticatedAuth> {
	const auth = await getAuth()
	if (!auth.authenticated) {
		throw new Response(
			JSON.stringify({
				success: false,
				error: { code: 'UNAUTHORIZED', message: 'Não autenticado' },
			}),
			{ status: 401, headers: { 'Content-Type': 'application/json' } }
		)
	}
	return auth
}
export async function requireSeller(): Promise<SellerAuth> {
	const auth = await requireAuth()
	const roles = await getUserRoles(auth.user.id)
	if (!roles.includes('seller')) {
		throw new Response(
			JSON.stringify({
				success: false,
				error: {
					code: 'FORBIDDEN',
					message: 'Apenas lojas podem aceder a este recurso',
				},
			}),
			{ status: 403, headers: { 'Content-Type': 'application/json' } }
		)
	}
	const store = await getStoreByOwnerId(auth.user.id)
	if (!store) {
		throw new Response(
			JSON.stringify({
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Crie a sua loja antes de aceder a este recurso',
				},
			}),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		)
	}
	return { ...auth, store }
}
export async function requireAdmin(): Promise<AdminAuth> {
	const auth = await requireAuth()
	const roles = await getUserRoles(auth.user.id)
	const isAdmin = roles.some((r) => r === 'admin' || r === 'super_admin')
	if (!isAdmin) {
		throw new Response(
			JSON.stringify({
				success: false,
				error: {
					code: 'FORBIDDEN',
					message: 'Acesso restrito a administradores',
				},
			}),
			{ status: 403, headers: { 'Content-Type': 'application/json' } }
		)
	}
	return { ...auth, roles }
}
export async function requireConversationParticipant(
	conversationId: string
): Promise<
	AuthenticatedAuth & {
		participant: {
			user_id: string
			last_read_at: string | null
		}
	}
> {
	const auth = await requireAuth()
	const supabase = createSupabaseAdmin()
	const { data: participant, error } = await supabase
		.from('conversation_participants')
		.select('user_id, last_read_at')
		.eq('conversation_id', conversationId)
		.eq('user_id', auth.user.id)
		.single()
	if (error || !participant) {
		throw new Response(
			JSON.stringify({
				success: false,
				error: {
					code: 'FORBIDDEN',
					message: 'Não é participante desta conversa',
				},
			}),
			{ status: 403, headers: { 'Content-Type': 'application/json' } }
		)
	}
	const { data: conversation } = await supabase
		.from('conversations')
		.select('store_id')
		.eq('id', conversationId)
		.is('deleted_at', null)
		.maybeSingle()
	if (conversation?.store_id) {
		const managedStoreIds = await getManagedStoreIds(auth.user.id)
		if (managedStoreIds.includes(conversation.store_id as string)) {
			throw new Response(
				JSON.stringify({
					success: false,
					error: {
						code: 'FORBIDDEN',
						message:
							'Esta conversa pertence à sua loja. Use o dashboard do vendedor.',
					},
				}),
				{ status: 403, headers: { 'Content-Type': 'application/json' } }
			)
		}
	}
	return { ...auth, participant }
}
